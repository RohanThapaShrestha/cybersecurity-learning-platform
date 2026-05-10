import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import pool from '@/lib/db';
import { withAuth } from '@/lib/withAuth';
import { JWTPayload } from '@/lib/auth';
import { submitHomework as memSubmit, isDbAvailable } from '@/lib/memoryAuth';

const SubmitSchema = z.object({
  answerText: z.string().min(1, 'Answer cannot be empty').max(10000),
});

const TOTAL_LESSONS = 14;
const TOTAL_HOMEWORK = 20;

// POST /api/homework/:id/submit
export const POST = withAuth(
  async (
    req: NextRequest,
    user: JWTPayload,
    context?: { params: Promise<Record<string, string>> }
  ) => {
    const params = await context?.params;
    const homeworkId = params?.id;

    if (!homeworkId) {
      return NextResponse.json({ error: 'Homework ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const parsed = SubmitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { answerText } = parsed.data;

    const dbOk = await isDbAvailable(pool);

    if (dbOk) {
      try {
        // Upsert submission
        const submission = await pool.query(
          `INSERT INTO homework_submissions (user_id, homework_id, answer_text, status)
           VALUES ($1, $2, $3, 'submitted')
           ON CONFLICT (user_id, homework_id)
           DO UPDATE SET answer_text = EXCLUDED.answer_text,
                         status = 'submitted',
                         submitted_at = NOW()
           RETURNING *`,
          [user.userId, homeworkId, answerText]
        );

        // Update progress
        await pool.query(
          `UPDATE progress
           SET completed_homework = CASE
             WHEN completed_homework @> $2::jsonb THEN completed_homework
             ELSE completed_homework || $2::jsonb
           END,
           last_activity = NOW(),
           completion_percentage = (
             SELECT ROUND(
               (jsonb_array_length(completed_lessons)::numeric + 
                (CASE WHEN completed_homework @> $2::jsonb 
                      THEN jsonb_array_length(completed_homework) 
                      ELSE jsonb_array_length(completed_homework) + 1 END)::numeric
               ) / $3::numeric * 100, 2
             )
           )
           WHERE user_id = $1`,
          [user.userId, JSON.stringify([homeworkId]), TOTAL_LESSONS + TOTAL_HOMEWORK]
        );

        return NextResponse.json({ submission: submission.rows[0] }, { status: 200 });
      } catch {
        // Fall through to memory
      }
    }

    // In-memory fallback
    const sub = memSubmit(user.userId, homeworkId, answerText);
    return NextResponse.json({ submission: sub }, { status: 200 });
  }
);
