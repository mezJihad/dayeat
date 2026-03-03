export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            menu_items: {
                Row: {
                    category: Database["public"]["Enums"]["menu_category"]
                    created_at: string | null
                    description: string | null
                    id: string
                    is_active_today: boolean | null
                    is_sold_out: boolean | null
                    is_template: boolean | null
                    meal_period: Database["public"]["Enums"]["meal_period"]
                    photo_url: string | null
                    price: number
                    published_at: string | null
                    restaurant_id: string
                    title: string
                    accepts_reservations: boolean | null
                    is_dine_in: boolean | null
                    is_takeaway: boolean | null
                }
                Insert: {
                    category: Database["public"]["Enums"]["menu_category"]
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_active_today?: boolean | null
                    is_sold_out?: boolean | null
                    is_template?: boolean | null
                    meal_period: Database["public"]["Enums"]["meal_period"]
                    photo_url?: string | null
                    price: number
                    published_at?: string | null
                    restaurant_id: string
                    title: string
                    accepts_reservations?: boolean | null
                    is_dine_in?: boolean | null
                    is_takeaway?: boolean | null
                }
                Update: {
                    category?: Database["public"]["Enums"]["menu_category"]
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_active_today?: boolean | null
                    is_sold_out?: boolean | null
                    is_template?: boolean | null
                    meal_period?: Database["public"]["Enums"]["meal_period"]
                    photo_url?: string | null
                    price?: number
                    published_at?: string | null
                    restaurant_id?: string
                    title?: string
                    accepts_reservations?: boolean | null
                    is_dine_in?: boolean | null
                    is_takeaway?: boolean | null
                }
                Relationships: [
                    {
                        foreignKeyName: "menu_items_restaurant_id_fkey"
                        columns: ["restaurant_id"]
                        isOneToOne: false
                        referencedRelation: "restaurants"
                        referencedColumns: ["id"]
                    }
                ]
            }
            restaurants: {
                Row: {
                    address: string | null
                    created_at: string | null
                    id: string
                    is_open: boolean | null
                    location: unknown // geography(POINT) is complex, usually string or GeoJSON in JS
                    logo_url: string | null
                    name: string
                    owner_id: string
                    whatsapp_phone: string
                }
                Insert: {
                    address?: string | null
                    created_at?: string | null
                    id?: string
                    is_open?: boolean | null
                    location: unknown
                    logo_url?: string | null
                    name: string
                    owner_id: string
                    whatsapp_phone: string
                }
                Update: {
                    address?: string | null
                    created_at?: string | null
                    id?: string
                    is_open?: boolean | null
                    location?: unknown
                    logo_url?: string | null
                    name?: string
                    owner_id?: string
                    whatsapp_phone?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "restaurants_owner_id_fkey"
                        columns: ["owner_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_menus_around: {
                Args: {
                    lat: number
                    long: number
                    radius_meters?: number
                }
                Returns: {
                    menu_item_id: string
                    title: string
                    description: string | null
                    price: number
                    photo_url: string | null
                    category: Database["public"]["Enums"]["menu_category"]
                    meal_period: Database["public"]["Enums"]["meal_period"]
                    is_sold_out: boolean | null
                    restaurant_id: string
                    restaurant_name: string
                    restaurant_phone: string
                    restaurant_address: string | null
                    restaurant_lat: number
                    restaurant_long: number
                    dist_meters: number
                    accepts_reservations: boolean | null
                    is_dine_in: boolean | null
                    is_takeaway: boolean | null
                }[]
            }
            get_all_active_menus: {
                Args: Record<PropertyKey, never>
                Returns: {
                    menu_item_id: string
                    title: string
                    description: string | null
                    price: number
                    photo_url: string | null
                    category: Database["public"]["Enums"]["menu_category"]
                    meal_period: Database["public"]["Enums"]["meal_period"]
                    is_sold_out: boolean | null
                    restaurant_id: string
                    restaurant_name: string
                    restaurant_phone: string
                    restaurant_address: string | null
                    restaurant_lat: number
                    restaurant_long: number
                    dist_meters: number
                    accepts_reservations: boolean | null
                    is_dine_in: boolean | null
                    is_takeaway: boolean | null
                }[]
            }
            delete_user: {
                Args: Record<PropertyKey, never>
                Returns: undefined
            }
        }
        Enums: {
            meal_period: "Petit-Dej" | "Dejeuner" | "Gouter" | "Diner" | "AntiGaspi"
            menu_category: "Entrée" | "Plat" | "Dessert" | "Boisson" | "Formule"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type MenuItem = Tables<"menu_items">
export type Restaurant = Tables<"restaurants">
