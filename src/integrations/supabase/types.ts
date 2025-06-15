export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cart_items: {
        Row: {
          added_at: string | null
          id: string
          product_id: string | null
          quantity: number | null
          user_id: string | null
        }
        Insert: {
          added_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number | null
          user_id?: string | null
        }
        Update: {
          added_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          label: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          label: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          label?: string
          name?: string
        }
        Relationships: []
      }
      expert_activity: {
        Row: {
          created_at: string
          expert_name: string
          id: string
          last_review_at: string | null
          reviews_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          expert_name: string
          id?: string
          last_review_at?: string | null
          reviews_count?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          expert_name?: string
          id?: string
          last_review_at?: string | null
          reviews_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      expert_reviews: {
        Row: {
          action: string
          comment: string
          created_at: string
          expert_name: string
          id: string
          reviewed_at: string
          submission_id: string
        }
        Insert: {
          action: string
          comment: string
          created_at?: string
          expert_name: string
          id?: string
          reviewed_at?: string
          submission_id: string
        }
        Update: {
          action?: string
          comment?: string
          created_at?: string
          expert_name?: string
          id?: string
          reviewed_at?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_reviews_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "feedback_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_stats: {
        Row: {
          approval_rate: number | null
          approved_today: number
          average_review_time_hours: number | null
          created_at: string
          date: string
          id: string
          pending_review: number
          rejected_today: number
          total_submissions: number
          updated_at: string
        }
        Insert: {
          approval_rate?: number | null
          approved_today?: number
          average_review_time_hours?: number | null
          created_at?: string
          date?: string
          id?: string
          pending_review?: number
          rejected_today?: number
          total_submissions?: number
          updated_at?: string
        }
        Update: {
          approval_rate?: number | null
          approved_today?: number
          average_review_time_hours?: number | null
          created_at?: string
          date?: string
          id?: string
          pending_review?: number
          rejected_today?: number
          total_submissions?: number
          updated_at?: string
        }
        Relationships: []
      }
      feedback_submissions: {
        Row: {
          content_id: string
          content_title: string
          content_type: string
          created_at: string
          id: string
          status: string
          submitted_at: string
          submitted_by: string
          updated_at: string
        }
        Insert: {
          content_id: string
          content_title: string
          content_type: string
          created_at?: string
          id?: string
          status?: string
          submitted_at?: string
          submitted_by: string
          updated_at?: string
        }
        Update: {
          content_id?: string
          content_title?: string
          content_type?: string
          created_at?: string
          id?: string
          status?: string
          submitted_at?: string
          submitted_by?: string
          updated_at?: string
        }
        Relationships: []
      }
      formations: {
        Row: {
          author_id: string | null
          badge: string | null
          category: string | null
          category_id: string | null
          completion_rate: number | null
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          duration: number | null
          duration_hours: number | null
          id: string
          image_url: string | null
          instructor_id: string | null
          is_active: boolean | null
          level_count: number | null
          original_price: number | null
          price: number | null
          promo_video_url: string | null
          rating: number | null
          students_count: number | null
          thumbnail_url: string | null
          title: string | null
          total_lessons: number | null
          updated_at: string | null
          video_promo_id: string | null
        }
        Insert: {
          author_id?: string | null
          badge?: string | null
          category?: string | null
          category_id?: string | null
          completion_rate?: number | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          duration?: number | null
          duration_hours?: number | null
          id: string
          image_url?: string | null
          instructor_id?: string | null
          is_active?: boolean | null
          level_count?: number | null
          original_price?: number | null
          price?: number | null
          promo_video_url?: string | null
          rating?: number | null
          students_count?: number | null
          thumbnail_url?: string | null
          title?: string | null
          total_lessons?: number | null
          updated_at?: string | null
          video_promo_id?: string | null
        }
        Update: {
          author_id?: string | null
          badge?: string | null
          category?: string | null
          category_id?: string | null
          completion_rate?: number | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          duration?: number | null
          duration_hours?: number | null
          id?: string
          image_url?: string | null
          instructor_id?: string | null
          is_active?: boolean | null
          level_count?: number | null
          original_price?: number | null
          price?: number | null
          promo_video_url?: string | null
          rating?: number | null
          students_count?: number | null
          thumbnail_url?: string | null
          title?: string | null
          total_lessons?: number | null
          updated_at?: string | null
          video_promo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "formations_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "formations_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "formations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "formations_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "formations_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string | null
          description: string | null
          duration: string | null
          has_exercise: boolean | null
          id: string
          level_id: string | null
          order_index: number
          title: string
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          has_exercise?: boolean | null
          id?: string
          level_id?: string | null
          order_index: number
          title: string
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          has_exercise?: boolean | null
          id?: string
          level_id?: string | null
          order_index?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          created_at: string | null
          description: string | null
          formation_id: string | null
          id: string
          order_index: number
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          formation_id?: string | null
          id?: string
          order_index: number
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          formation_id?: string | null
          id?: string
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "levels_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_for_all_admins: boolean
          is_read: boolean
          message: string
          order_id: string | null
          title: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_for_all_admins?: boolean
          is_read?: boolean
          message: string
          order_id?: string | null
          title: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_for_all_admins?: boolean
          is_read?: boolean
          message?: string
          order_id?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          quantity: number
        }
        Update: {
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          total_amount: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          total_amount: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          total_amount?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          badge: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          id: string
          image_url: string | null
          instructor_id: string | null
          is_active: boolean | null
          original_price: number | null
          price: number
          product_type: Database["public"]["Enums"]["product_type"]
          promo_video_url: string | null
          rating: number | null
          students_count: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          badge?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          instructor_id?: string | null
          is_active?: boolean | null
          original_price?: number | null
          price: number
          product_type: Database["public"]["Enums"]["product_type"]
          promo_video_url?: string | null
          rating?: number | null
          students_count?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          badge?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          instructor_id?: string | null
          is_active?: boolean | null
          original_price?: number | null
          price?: number
          product_type?: Database["public"]["Enums"]["product_type"]
          promo_video_url?: string | null
          rating?: number | null
          students_count?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          subscribers_count: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          subscribers_count?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          subscribers_count?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_enrollments: {
        Row: {
          enrolled_at: string | null
          expires_at: string | null
          formation_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          enrolled_at?: string | null
          expires_at?: string | null
          formation_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          enrolled_at?: string | null
          expires_at?: string | null
          formation_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_enrollments_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_progress: {
        Row: {
          completed_at: string | null
          exercise_completed: boolean | null
          id: string
          lesson_id: string | null
          status: Database["public"]["Enums"]["lesson_status"] | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          exercise_completed?: boolean | null
          id?: string
          lesson_id?: string | null
          status?: Database["public"]["Enums"]["lesson_status"] | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          exercise_completed?: boolean | null
          id?: string
          lesson_id?: string | null
          status?: Database["public"]["Enums"]["lesson_status"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      video_comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "video_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      video_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number
          parent_comment_id: string | null
          updated_at: string
          user_id: string
          video_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          parent_comment_id?: string | null
          updated_at?: string
          user_id: string
          video_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          parent_comment_id?: string | null
          updated_at?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "video_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_likes: {
        Row: {
          created_at: string
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          author_id: string | null
          comments_count: number | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          likes_count: number | null
          product_id: string | null
          thumbnail_url: string | null
          title: string
          video_type: Database["public"]["Enums"]["video_type"] | null
          video_url: string | null
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          product_id?: string | null
          thumbnail_url?: string | null
          title: string
          video_type?: Database["public"]["Enums"]["video_type"] | null
          video_url?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          product_id?: string | null
          thumbnail_url?: string | null
          title?: string
          video_type?: Database["public"]["Enums"]["video_type"] | null
          video_url?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_courses: {
        Args: { user_id_param: string }
        Returns: {
          id: string
          title: string
          image_url: string
          total_lessons: number
          completed_lessons: number
          product_type: Database["public"]["Enums"]["product_type"]
        }[]
      }
    }
    Enums: {
      lesson_status: "locked" | "available" | "completed"
      product_type: "formation" | "article" | "service"
      user_role: "student" | "instructor" | "admin"
      video_type: "promo" | "educational" | "testimonial"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      lesson_status: ["locked", "available", "completed"],
      product_type: ["formation", "article", "service"],
      user_role: ["student", "instructor", "admin"],
      video_type: ["promo", "educational", "testimonial"],
    },
  },
} as const
