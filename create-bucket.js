const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nqdcozrmzeysupcdjicu.supabase.co';
const supabaseKey = 'sb_publishable_kKakVgKv_7gaECPfHLrRdQ_p_ENL0Uf';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBucket() {
  const { data, error } = await supabase.storage.createBucket('images', {
    public: true,
    allowedMimeTypes: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'],
    fileSizeLimit: 10485760, // 10MB
  });

  if (error) {
    console.error('❌ Error creating bucket:', error.message);
  } else {
    console.log('✅ Bucket "images" created successfully!', data);
  }
}

createBucket();
