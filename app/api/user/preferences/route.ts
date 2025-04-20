import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false // Don't persist the session in the client since we're on the server
    }
  }
);

export async function PUT(request: Request) {
  try {
    // Get the session from the cookie
    const cookieStore = cookies();
    const supabaseToken = cookieStore.get('sb-access-token')?.value;

    if (!supabaseToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Set the auth token for this request
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: supabaseToken,
      refresh_token: cookieStore.get('sb-refresh-token')?.value || '',
    });

    if (sessionError) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      emailNotifications,
      smsNotifications,
      shirtSize,
      firstName,
      lastName,
      email,
      phoneNumber
    } = body;

    // Update the user's profile in Supabase
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications,
        shirt_size: shirtSize,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phoneNumber,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Update preferences error:", error);
      return NextResponse.json(
        { error: "Failed to update preferences" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Update preferences error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
