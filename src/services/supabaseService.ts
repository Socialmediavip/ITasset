import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];

class SupabaseService {
  // Users
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createUser(user: Tables['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateUser(id: string, user: Tables['users']['Update']) {
    const { data, error } = await supabase
      .from('users')
      .update(user)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteUser(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Assets
  async getAssets() {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createAsset(asset: Tables['assets']['Insert']) {
    const { data, error } = await supabase
      .from('assets')
      .insert(asset)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateAsset(id: string, asset: Tables['assets']['Update']) {
    const { data, error } = await supabase
      .from('assets')
      .update(asset)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteAsset(id: string) {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Licenses
  async getLicenses() {
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createLicense(license: Tables['licenses']['Insert']) {
    const { data, error } = await supabase
      .from('licenses')
      .insert(license)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateLicense(id: string, license: Tables['licenses']['Update']) {
    const { data, error } = await supabase
      .from('licenses')
      .update(license)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteLicense(id: string) {
    const { error } = await supabase
      .from('licenses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Accessories
  async getAccessories() {
    const { data, error } = await supabase
      .from('accessories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createAccessory(accessory: Tables['accessories']['Insert']) {
    const { data, error } = await supabase
      .from('accessories')
      .insert(accessory)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateAccessory(id: string, accessory: Tables['accessories']['Update']) {
    const { data, error } = await supabase
      .from('accessories')
      .update(accessory)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteAccessory(id: string) {
    const { error } = await supabase
      .from('accessories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Consumables
  async getConsumables() {
    const { data, error } = await supabase
      .from('consumables')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createConsumable(consumable: Tables['consumables']['Insert']) {
    const { data, error } = await supabase
      .from('consumables')
      .insert(consumable)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateConsumable(id: string, consumable: Tables['consumables']['Update']) {
    const { data, error } = await supabase
      .from('consumables')
      .update(consumable)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteConsumable(id: string) {
    const { error } = await supabase
      .from('consumables')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Components
  async getComponents() {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createComponent(component: Tables['components']['Insert']) {
    const { data, error } = await supabase
      .from('components')
      .insert(component)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateComponent(id: string, component: Tables['components']['Update']) {
    const { data, error } = await supabase
      .from('components')
      .update(component)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteComponent(id: string) {
    const { error } = await supabase
      .from('components')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Predefined Kits
  async getPredefinedKits() {
    const { data, error } = await supabase
      .from('predefined_kits')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createPredefinedKit(kit: Tables['predefined_kits']['Insert']) {
    const { data, error } = await supabase
      .from('predefined_kits')
      .insert(kit)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updatePredefinedKit(id: string, kit: Tables['predefined_kits']['Update']) {
    const { data, error } = await supabase
      .from('predefined_kits')
      .update(kit)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deletePredefinedKit(id: string) {
    const { error } = await supabase
      .from('predefined_kits')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Requestable Items
  async getRequestableItems() {
    const { data, error } = await supabase
      .from('requestable_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createRequestableItem(item: Tables['requestable_items']['Insert']) {
    const { data, error } = await supabase
      .from('requestable_items')
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateRequestableItem(id: string, item: Tables['requestable_items']['Update']) {
    const { data, error } = await supabase
      .from('requestable_items')
      .update(item)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteRequestableItem(id: string) {
    const { error } = await supabase
      .from('requestable_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Alerts
  async getAlerts() {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createAlert(alert: Tables['alerts']['Insert']) {
    const { data, error } = await supabase
      .from('alerts')
      .insert(alert)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateAlert(id: string, alert: Tables['alerts']['Update']) {
    const { data, error } = await supabase
      .from('alerts')
      .update(alert)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async acknowledgeAlert(id: string) {
    const { data, error } = await supabase
      .from('alerts')
      .update({ 
        status: 'acknowledged',
        acknowledged_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async resolveAlert(id: string) {
    const { data, error } = await supabase
      .from('alerts')
      .update({ 
        status: 'resolved',
        resolved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async dismissAlert(id: string) {
    const { data, error } = await supabase
      .from('alerts')
      .update({ status: 'dismissed' })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Maintenance Records
  async getMaintenanceRecords() {
    const { data, error } = await supabase
      .from('maintenance_records')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createMaintenanceRecord(record: Tables['maintenance_records']['Insert']) {
    const { data, error } = await supabase
      .from('maintenance_records')
      .insert(record)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateMaintenanceRecord(id: string, record: Tables['maintenance_records']['Update']) {
    const { data, error } = await supabase
      .from('maintenance_records')
      .update(record)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteMaintenanceRecord(id: string) {
    const { error } = await supabase
      .from('maintenance_records')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Compliance Checks
  async getComplianceChecks() {
    const { data, error } = await supabase
      .from('compliance_checks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createComplianceCheck(check: Tables['compliance_checks']['Insert']) {
    const { data, error } = await supabase
      .from('compliance_checks')
      .insert(check)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getPolicyViolations() {
    const { data, error } = await supabase
      .from('policy_violations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async resolvePolicyViolation(id: string) {
    const { data, error } = await supabase
      .from('policy_violations')
      .update({ 
        status: 'Resolved',
        resolved_date: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Integrations
  async getIntegrations() {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createIntegration(integration: Tables['integrations']['Insert']) {
    const { data, error } = await supabase
      .from('integrations')
      .insert(integration)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateIntegration(id: string, integration: Tables['integrations']['Update']) {
    const { data, error } = await supabase
      .from('integrations')
      .update(integration)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteIntegration(id: string) {
    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async syncIntegration(id: string) {
    const { data, error } = await supabase
      .from('integrations')
      .update({ 
        status: 'Syncing',
        last_sync: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Import Records
  async getImportRecords() {
    const { data, error } = await supabase
      .from('import_records')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createImportRecord(record: Tables['import_records']['Insert']) {
    const { data, error } = await supabase
      .from('import_records')
      .insert(record)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateImportRecord(id: string, record: Tables['import_records']['Update']) {
    const { data, error } = await supabase
      .from('import_records')
      .update(record)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Reports
  async getReports() {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createReport(report: Tables['reports']['Insert']) {
    const { data, error } = await supabase
      .from('reports')
      .insert(report)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Real-time subscriptions
  subscribeToAlerts(callback: (payload: any) => void) {
    return supabase
      .channel('alerts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, callback)
      .subscribe();
  }

  subscribeToAssets(callback: (payload: any) => void) {
    return supabase
      .channel('assets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assets' }, callback)
      .subscribe();
  }

  subscribeToMaintenanceRecords(callback: (payload: any) => void) {
    return supabase
      .channel('maintenance_records')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'maintenance_records' }, callback)
      .subscribe();
  }

  subscribeToComplianceChecks(callback: (payload: any) => void) {
    return supabase
      .channel('compliance_checks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'compliance_checks' }, callback)
      .subscribe();
  }

  subscribeToIntegrations(callback: (payload: any) => void) {
    return supabase
      .channel('integrations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'integrations' }, callback)
      .subscribe();
  }

  subscribeToImportRecords(callback: (payload: any) => void) {
    return supabase
      .channel('import_records')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'import_records' }, callback)
      .subscribe();
  }
}

export const supabaseService = new SupabaseService();
export default supabaseService;