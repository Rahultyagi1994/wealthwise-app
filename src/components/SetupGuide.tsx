import { useState } from 'react';
import { Database, CheckCircle, ExternalLink, Copy, Check } from 'lucide-react';

export default function SetupGuide() {
  const [copiedSQL, setCopiedSQL] = useState(false);

  const sqlCode = `-- Run this in Supabase SQL Editor to create the user_data table

CREATE TABLE IF NOT EXISTS user_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  profile JSONB DEFAULT NULL,
  investments JSONB DEFAULT '[]'::jsonb,
  goals JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only access their own data
CREATE POLICY "Users can view own data" ON user_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON user_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON user_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data" ON user_data
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);`;

  const copySQL = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-full mb-4">
            <Database className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Setup Cloud Database</h1>
          <p className="text-gray-400">
            Follow these steps to enable cloud storage for your WealthWise app (FREE)
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Create a Supabase Account</h3>
                <p className="text-gray-400 mb-4">
                  Go to Supabase and create a free account. The free tier includes:
                </p>
                <ul className="text-gray-400 text-sm space-y-1 mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    500 MB database storage
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Unlimited API requests
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    50,000 monthly active users
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Social OAuth providers
                  </li>
                </ul>
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Go to Supabase <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Create a New Project</h3>
                <p className="text-gray-400 mb-4">
                  After signing in:
                </p>
                <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
                  <li>Click <strong className="text-white">"New Project"</strong></li>
                  <li>Enter a project name (e.g., "wealthwise")</li>
                  <li>Create a <strong className="text-white">secure database password</strong> (save this!)</li>
                  <li>Select a region closest to your users</li>
                  <li>Click <strong className="text-white">"Create new project"</strong></li>
                  <li>Wait 2-3 minutes for the project to be ready</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Create the Database Table</h3>
                <p className="text-gray-400 mb-4">
                  Go to <strong className="text-white">SQL Editor</strong> in the left sidebar and run this SQL:
                </p>
                <div className="relative">
                  <pre className="bg-slate-900 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto max-h-64 overflow-y-auto">
                    {sqlCode}
                  </pre>
                  <button
                    onClick={copySQL}
                    className="absolute top-2 right-2 p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    {copiedSQL ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Copy className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Enable Email Authentication</h3>
                <p className="text-gray-400 mb-4">
                  In the left sidebar:
                </p>
                <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
                  <li>Go to <strong className="text-white">Authentication</strong></li>
                  <li>Click <strong className="text-white">Providers</strong></li>
                  <li>Make sure <strong className="text-white">Email</strong> is enabled</li>
                  <li>(Optional) Disable email confirmation for testing</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Get Your API Keys</h3>
                <p className="text-gray-400 mb-4">
                  Go to <strong className="text-white">Project Settings → API</strong> and copy:
                </p>
                <ul className="text-gray-400 text-sm space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <span><strong className="text-white">Project URL</strong> - looks like https://xxxxx.supabase.co</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <span><strong className="text-white">anon public</strong> key - the long string under "Project API keys"</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                6
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Add Environment Variables</h3>
                <p className="text-gray-400 mb-4">
                  Create a <code className="bg-slate-700 px-2 py-1 rounded">.env</code> file in your project root:
                </p>
                <pre className="bg-slate-900 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`}
                </pre>
                <p className="text-yellow-400 text-sm mt-4">
                  ⚠️ Never commit your .env file to git! Add it to .gitignore
                </p>
              </div>
            </div>
          </div>

          {/* Step 7 - Deploy */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                7
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Deploy for FREE</h3>
                <p className="text-gray-400 mb-4">
                  Deploy your app for free on one of these platforms:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">▲</div>
                    <div className="text-white font-semibold">Vercel</div>
                    <div className="text-gray-400 text-sm">Best for React</div>
                  </a>
                  <a
                    href="https://netlify.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">◆</div>
                    <div className="text-white font-semibold">Netlify</div>
                    <div className="text-gray-400 text-sm">Easy deploy</div>
                  </a>
                  <a
                    href="https://railway.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">🚂</div>
                    <div className="text-white font-semibold">Railway</div>
                    <div className="text-gray-400 text-sm">Simple & fast</div>
                  </a>
                </div>
                <p className="text-gray-400 text-sm mt-4">
                  Remember to add your environment variables in the deployment platform's settings!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl border border-green-500/30 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            Total Cost Summary
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">$0</div>
              <div className="text-gray-400 text-sm">Supabase (50K users)</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">$0</div>
              <div className="text-gray-400 text-sm">Vercel/Netlify hosting</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">$0</div>
              <div className="text-gray-400 text-sm">Total monthly cost</div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 mt-8 text-sm">
          The app works with localStorage until you configure Supabase. Your users' data is safe either way!
        </p>
      </div>
    </div>
  );
}
