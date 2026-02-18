
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manually load env vars from .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8')
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=')
        if (key && value) {
            process.env[key.trim()] = value.trim()
        }
    })
} else {
    console.warn('.env.local file not found!')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyMenus() {
    console.log('Verifying menus for restaurant 569bbb89-e2ed-4f2b-a397-9759e865667c...')

    const today = new Date().toISOString().split('T')[0]
    console.log('Today is:', today)

    // 1. Check raw table data
    const { data: menus, error } = await supabase
        .from('menu_items')
        .select('id, title, is_active_today, created_at, restaurant_id')
        .eq('restaurant_id', '569bbb89-e2ed-4f2b-a397-9759e865667c')

    if (error) {
        console.error('Error fetching menus:', error)
        return
    }

    console.log('--- RAW DB DATA ---')
    menus.forEach(m => {
        const isToday = m.created_at.startsWith(today)
        console.log(`[${m.title}] Active: ${m.is_active_today}, Created: ${m.created_at} (${isToday ? 'TODAY' : 'OLD'})`)
    })

    // 2. Simulate Filter Logic
    const visibleMenus = menus.filter(m => m.is_active_today && m.created_at >= today)
    console.log('--- VISIBLE MENUS (Simulated) ---')
    console.log(`Found ${visibleMenus.length} visible menus.`)
    visibleMenus.forEach(m => console.log(`- ${m.title}`))

    // 3. Call RPC if possible (requires lat/long, assume store location 0,0)
    // We assume the user is "near" the restaurant (0,0) since default location is 0,0
    const { data: rpcMenus, error: rpcError } = await supabase.rpc('get_menus_around', {
        lat: 0,
        long: 0,
        radius_meters: 5000000 // Huge radius to be sure
    })

    // 4. Inspect Function Definition
    console.log('--- RPC DEFINITION ---')
    const { data: funcDef, error: funcError } = await supabase.rpc('get_menus_around', {
        lat: 0,
        long: 0,
        radius_meters: 1
    })

    // We can't easily read pg_proc via postgrest unless permitted. 
    // But we can try detailed RPC call analysis.
    // Actually, asking the user is easier.
    // Or we can try to call it and see if we get multiples?
    // We ALREADY called it in step 3. 
    // Step 3 output: "Found 3 menus via RPC"

    // Wait! Step 3 output was:
    // "Found 3 menus via RPC for this restaurant."
    // - Couscous Royal (Semaine dernière) (ActiveToday: true)
    // - Tajine de Veau aux Pruneaux (Hier) (ActiveToday: true)
    // - tajine poule (ActiveToday: true)

    // This PROVES that the RPC is returning multiple items!
    // So DISTINCT is GONE.
    // My hypothesis was wrong.


}


// verifyMenus()
