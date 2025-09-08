import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          username: string;
          email: string;
          department: string;
          location: string;
          job_title: string;
          manager: string;
          employee_number: string;
          phone: string;
          activated: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          username: string;
          email: string;
          department?: string;
          location?: string;
          job_title?: string;
          manager?: string;
          employee_number?: string;
          phone?: string;
          activated?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          username?: string;
          email?: string;
          department?: string;
          location?: string;
          job_title?: string;
          manager?: string;
          employee_number?: string;
          phone?: string;
          activated?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      assets: {
        Row: {
          id: string;
          name: string;
          tag: string;
          category: string;
          subcategory: string;
          model: string;
          manufacturer: string;
          serial_number: string;
          status: string;
          assigned_to: string | null;
          assigned_department: string;
          location: any;
          purchase_date: string | null;
          purchase_cost: number;
          warranty_expiry: string | null;
          warranty_status: string;
          notes: string;
          barcode: string;
          qr_code: string;
          specifications: any;
          lifecycle_stage: string;
          compliance_status: string;
          discovery_source: string;
          last_audit_date: string | null;
          next_maintenance_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          tag: string;
          category?: string;
          subcategory?: string;
          model?: string;
          manufacturer?: string;
          serial_number?: string;
          status?: string;
          assigned_to?: string | null;
          assigned_department?: string;
          location?: any;
          purchase_date?: string | null;
          purchase_cost?: number;
          warranty_expiry?: string | null;
          warranty_status?: string;
          notes?: string;
          barcode?: string;
          qr_code?: string;
          specifications?: any;
          lifecycle_stage?: string;
          compliance_status?: string;
          discovery_source?: string;
          last_audit_date?: string | null;
          next_maintenance_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          tag?: string;
          category?: string;
          subcategory?: string;
          model?: string;
          manufacturer?: string;
          serial_number?: string;
          status?: string;
          assigned_to?: string | null;
          assigned_department?: string;
          location?: any;
          purchase_date?: string | null;
          purchase_cost?: number;
          warranty_expiry?: string | null;
          warranty_status?: string;
          notes?: string;
          barcode?: string;
          qr_code?: string;
          specifications?: any;
          lifecycle_stage?: string;
          compliance_status?: string;
          discovery_source?: string;
          last_audit_date?: string | null;
          next_maintenance_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      licenses: {
        Row: {
          id: string;
          name: string;
          product_key: string;
          seats: number;
          available_seats: number;
          manufacturer: string;
          expiry_date: string | null;
          category: string;
          cost: number;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          product_key?: string;
          seats?: number;
          available_seats?: number;
          manufacturer?: string;
          expiry_date?: string | null;
          category?: string;
          cost?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          product_key?: string;
          seats?: number;
          available_seats?: number;
          manufacturer?: string;
          expiry_date?: string | null;
          category?: string;
          cost?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      accessories: {
        Row: {
          id: string;
          name: string;
          category: string;
          manufacturer: string;
          model: string;
          quantity: number;
          available_quantity: number;
          location: string;
          purchase_date: string | null;
          purchase_cost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string;
          manufacturer?: string;
          model?: string;
          quantity?: number;
          available_quantity?: number;
          location?: string;
          purchase_date?: string | null;
          purchase_cost?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          manufacturer?: string;
          model?: string;
          quantity?: number;
          available_quantity?: number;
          location?: string;
          purchase_date?: string | null;
          purchase_cost?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      consumables: {
        Row: {
          id: string;
          name: string;
          category: string;
          manufacturer: string;
          model: string;
          quantity: number;
          min_quantity: number;
          location: string;
          item_number: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string;
          manufacturer?: string;
          model?: string;
          quantity?: number;
          min_quantity?: number;
          location?: string;
          item_number?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          manufacturer?: string;
          model?: string;
          quantity?: number;
          min_quantity?: number;
          location?: string;
          item_number?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      components: {
        Row: {
          id: string;
          name: string;
          category: string;
          manufacturer: string;
          model: string;
          serial_number: string;
          quantity: number;
          location: string;
          purchase_date: string | null;
          purchase_cost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string;
          manufacturer?: string;
          model?: string;
          serial_number?: string;
          quantity?: number;
          location?: string;
          purchase_date?: string | null;
          purchase_cost?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          manufacturer?: string;
          model?: string;
          serial_number?: string;
          quantity?: number;
          location?: string;
          purchase_date?: string | null;
          purchase_cost?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      predefined_kits: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: string;
          assets: string[];
          accessories: string[];
          licenses: string[];
          consumables: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          category?: string;
          assets?: string[];
          accessories?: string[];
          licenses?: string[];
          consumables?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          category?: string;
          assets?: string[];
          accessories?: string[];
          licenses?: string[];
          consumables?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      requestable_items: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string;
          image: string;
          requestable: boolean;
          quantity: number;
          location: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string;
          description?: string;
          image?: string;
          requestable?: boolean;
          quantity?: number;
          location?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          description?: string;
          image?: string;
          requestable?: boolean;
          quantity?: number;
          location?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          title: string;
          message: string;
          type: string;
          status: string;
          priority: string;
          category: string;
          asset_id: string | null;
          asset_name: string;
          created_at: string;
          updated_at: string;
          acknowledged_at: string | null;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          message?: string;
          type?: string;
          status?: string;
          priority?: string;
          category?: string;
          asset_id?: string | null;
          asset_name?: string;
          created_at?: string;
          updated_at?: string;
          acknowledged_at?: string | null;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          message?: string;
          type?: string;
          status?: string;
          priority?: string;
          category?: string;
          asset_id?: string | null;
          asset_name?: string;
          created_at?: string;
          updated_at?: string;
          acknowledged_at?: string | null;
          resolved_at?: string | null;
        };
      };
      maintenance_records: {
        Row: {
          id: string;
          asset_id: string | null;
          date: string;
          type: string;
          description: string;
          cost: number;
          vendor: string;
          technician: string;
          status: string;
          scheduled_date: string | null;
          completed_date: string | null;
          next_maintenance_date: string | null;
          parts_used: string[];
          incident_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          asset_id?: string | null;
          date?: string;
          type?: string;
          description?: string;
          cost?: number;
          vendor?: string;
          technician?: string;
          status?: string;
          scheduled_date?: string | null;
          completed_date?: string | null;
          next_maintenance_date?: string | null;
          parts_used?: string[];
          incident_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          asset_id?: string | null;
          date?: string;
          type?: string;
          description?: string;
          cost?: number;
          vendor?: string;
          technician?: string;
          status?: string;
          scheduled_date?: string | null;
          completed_date?: string | null;
          next_maintenance_date?: string | null;
          parts_used?: string[];
          incident_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      compliance_checks: {
        Row: {
          id: string;
          type: string;
          status: string;
          last_checked: string;
          next_check: string | null;
          auditor: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type?: string;
          status?: string;
          last_checked?: string;
          next_check?: string | null;
          auditor?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          status?: string;
          last_checked?: string;
          next_check?: string | null;
          auditor?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      policy_violations: {
        Row: {
          id: string;
          type: string;
          severity: string;
          description: string;
          detected_date: string;
          resolved_date: string | null;
          assigned_to: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type?: string;
          severity?: string;
          description?: string;
          detected_date?: string;
          resolved_date?: string | null;
          assigned_to?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          severity?: string;
          description?: string;
          detected_date?: string;
          resolved_date?: string | null;
          assigned_to?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      integrations: {
        Row: {
          id: string;
          name: string;
          type: string;
          endpoint: string;
          api_key: string;
          last_sync: string;
          sync_frequency: string;
          status: string;
          mappings: any;
          error_log: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type?: string;
          endpoint?: string;
          api_key?: string;
          last_sync?: string;
          sync_frequency?: string;
          status?: string;
          mappings?: any;
          error_log?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          endpoint?: string;
          api_key?: string;
          last_sync?: string;
          sync_frequency?: string;
          status?: string;
          mappings?: any;
          error_log?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      import_records: {
        Row: {
          id: string;
          file_name: string;
          type: string;
          status: string;
          records_processed: number;
          total_records: number;
          errors: string[];
          import_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          file_name: string;
          type?: string;
          status?: string;
          records_processed?: number;
          total_records?: number;
          errors?: string[];
          import_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          file_name?: string;
          type?: string;
          status?: string;
          records_processed?: number;
          total_records?: number;
          errors?: string[];
          import_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          name: string;
          type: string;
          description: string;
          parameters: any;
          last_run: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type?: string;
          description?: string;
          parameters?: any;
          last_run?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          description?: string;
          parameters?: any;
          last_run?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}