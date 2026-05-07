import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper to get authenticated user
const getAuthUser = async (authHeader: string | null) => {
  if (!authHeader) return null;
  const accessToken = authHeader.split(' ')[1];
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) return null;
  return user;
};

// Health check endpoint
app.get("/make-server-c8bf3146/health", (c) => {
  return c.json({ status: "ok" });
});

// Auth endpoints
app.post("/make-server-c8bf3146/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Error during user signup for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Initialize user profile
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      aura: 100,
      personality: 'Beta',
      createdAt: new Date().toISOString(),
    });

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Signup error: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-c8bf3146/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Error during user login for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ session: data.session, user: data.user });
  } catch (error) {
    console.log(`Login error: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// User profile endpoints
app.get("/make-server-c8bf3146/user/profile", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    return c.json({ profile });
  } catch (error) {
    console.log(`Error fetching user profile: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

app.put("/make-server-c8bf3146/user/profile", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const updates = await c.req.json();
    const currentProfile = await kv.get(`user:${user.id}`);
    const updatedProfile = { ...currentProfile, ...updates };

    await kv.set(`user:${user.id}`, updatedProfile);
    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.log(`Error updating user profile: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Habit endpoints
app.post("/make-server-c8bf3146/habits", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const habitData = await c.req.json();
    const habitId = crypto.randomUUID();
    const habit = {
      id: habitId,
      userId: user.id,
      ...habitData,
      createdAt: new Date().toISOString(),
      completions: [],
      streak: 0,
      status: 'active',
    };

    await kv.set(`habit:${habitId}`, habit);
    return c.json({ habit });
  } catch (error) {
    console.log(`Error creating habit: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-c8bf3146/habits", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const allHabits = await kv.getByPrefix('habit:');
    const userHabits = allHabits.filter((h: any) => h.userId === user.id);
    return c.json({ habits: userHabits });
  } catch (error) {
    console.log(`Error fetching habits: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

app.put("/make-server-c8bf3146/habits/:id", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const habitId = c.req.param('id');
    const updates = await c.req.json();
    const habit = await kv.get(`habit:${habitId}`);

    if (!habit || habit.userId !== user.id) {
      return c.json({ error: 'Habit not found' }, 404);
    }

    const updatedHabit = { ...habit, ...updates };
    await kv.set(`habit:${habitId}`, updatedHabit);
    return c.json({ habit: updatedHabit });
  } catch (error) {
    console.log(`Error updating habit: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

app.delete("/make-server-c8bf3146/habits/:id", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const habitId = c.req.param('id');
    const habit = await kv.get(`habit:${habitId}`);

    if (!habit || habit.userId !== user.id) {
      return c.json({ error: 'Habit not found' }, 404);
    }

    await kv.del(`habit:${habitId}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting habit: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Habit completion endpoint
app.post("/make-server-c8bf3146/habits/:id/complete", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const habitId = c.req.param('id');
    const { date, duration } = await c.req.json();
    const habit = await kv.get(`habit:${habitId}`);

    if (!habit || habit.userId !== user.id) {
      return c.json({ error: 'Habit not found' }, 404);
    }

    const completion = {
      date: date || new Date().toISOString(),
      duration: duration || 0,
    };

    habit.completions = habit.completions || [];
    habit.completions.push(completion);

    // Calculate streak
    const today = new Date().toISOString().split('T')[0];
    const sortedCompletions = habit.completions
      .map((c: any) => c.date.split('T')[0])
      .sort()
      .reverse();

    let streak = 0;
    let currentDate = new Date(today);
    for (const completionDate of sortedCompletions) {
      const checkDate = currentDate.toISOString().split('T')[0];
      if (completionDate === checkDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    habit.streak = streak;
    await kv.set(`habit:${habitId}`, habit);

    return c.json({ habit });
  } catch (error) {
    console.log(`Error completing habit: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Aura endpoints
app.post("/make-server-c8bf3146/aura/lose", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { amount, reason } = await c.req.json();
    const profile = await kv.get(`user:${user.id}`);

    profile.aura = Math.max(0, profile.aura - amount);
    profile.auraHistory = profile.auraHistory || [];
    profile.auraHistory.push({
      type: 'loss',
      amount,
      reason,
      date: new Date().toISOString(),
      auraAfter: profile.aura,
    });

    await kv.set(`user:${user.id}`, profile);
    return c.json({ profile });
  } catch (error) {
    console.log(`Error losing aura: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-c8bf3146/aura/gain", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { amount, reason } = await c.req.json();
    const profile = await kv.get(`user:${user.id}`);

    profile.aura += amount;
    profile.auraHistory = profile.auraHistory || [];
    profile.auraHistory.push({
      type: 'gain',
      amount,
      reason,
      date: new Date().toISOString(),
      auraAfter: profile.aura,
    });

    await kv.set(`user:${user.id}`, profile);
    return c.json({ profile });
  } catch (error) {
    console.log(`Error gaining aura: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

// Analytics endpoint
app.get("/make-server-c8bf3146/analytics", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const allHabits = await kv.getByPrefix('habit:');
    const userHabits = allHabits.filter((h: any) => h.userId === user.id);

    const profile = await kv.get(`user:${user.id}`);

    const analytics = {
      totalHabits: userHabits.length,
      activeHabits: userHabits.filter((h: any) => h.status === 'active').length,
      totalCompletions: userHabits.reduce((sum: number, h: any) => sum + (h.completions?.length || 0), 0),
      currentAura: profile.aura,
      auraHistory: profile.auraHistory || [],
      habitsByFrequency: {
        daily: userHabits.filter((h: any) => h.frequency === 'daily').length,
        weekly: userHabits.filter((h: any) => h.frequency === 'weekly').length,
        monthly: userHabits.filter((h: any) => h.frequency === 'monthly').length,
        custom: userHabits.filter((h: any) => h.frequency === 'custom').length,
      },
      longestStreak: Math.max(...userHabits.map((h: any) => h.streak || 0), 0),
    };

    return c.json({ analytics });
  } catch (error) {
    console.log(`Error fetching analytics: ${error.message}`);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);