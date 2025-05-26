export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  highest_education: string | null;
  company: string | null;
  experience_years: number | null;
  job_title: string | null;
  is_public: boolean;
  updated_at: string;
}