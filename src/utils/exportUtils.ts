export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
};

export const exportToJSON = (data: any[], filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
};

export const exportToExcel = (data: any[], filename: string) => {
  // Simple Excel-compatible CSV with UTF-8 BOM
  const BOM = '\uFEFF';
  const headers = Object.keys(data[0] || {});
  const csvContent = BOM + [
    headers.join('\t'),
    ...data.map(row => 
      headers.map(header => row[header] || '').join('\t')
    )
  ].join('\n');

  downloadFile(csvContent, filename, 'application/vnd.ms-excel');
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const generateAssetReport = (assets: any[]) => {
  return assets.map(asset => ({
    'Asset Tag': asset.tag,
    'Name': asset.name,
    'Category': asset.category,
    'Manufacturer': asset.manufacturer,
    'Model': asset.model,
    'Serial Number': asset.serialNumber,
    'Status': asset.status,
    'Assigned To': asset.assignedTo || 'Unassigned',
    'Location': asset.location,
    'Purchase Date': asset.purchaseDate,
    'Purchase Cost': asset.purchaseCost,
    'Warranty Expiry': asset.warrantyExpiry || 'N/A',
    'Notes': asset.notes || ''
  }));
};

export const generateLicenseReport = (licenses: any[]) => {
  return licenses.map(license => ({
    'License Name': license.name,
    'Product Key': license.productKey,
    'Manufacturer': license.manufacturer,
    'Category': license.category,
    'Total Seats': license.seats,
    'Available Seats': license.availableSeats,
    'Used Seats': license.seats - license.availableSeats,
    'Expiry Date': license.expiryDate || 'N/A',
    'Notes': license.notes || ''
  }));
};

export const generateAccessoryReport = (accessories: any[]) => {
  return accessories.map(accessory => ({
    'Name': accessory.name,
    'Category': accessory.category,
    'Manufacturer': accessory.manufacturer,
    'Model': accessory.model,
    'Total Quantity': accessory.quantity,
    'Available Quantity': accessory.availableQuantity,
    'Assigned Quantity': accessory.quantity - accessory.availableQuantity,
    'Location': accessory.location,
    'Purchase Date': accessory.purchaseDate,
    'Purchase Cost': accessory.purchaseCost
  }));
};

export const generateConsumableReport = (consumables: any[]) => {
  return consumables.map(consumable => ({
    'Name': consumable.name,
    'Category': consumable.category,
    'Manufacturer': consumable.manufacturer,
    'Model': consumable.model,
    'Current Quantity': consumable.quantity,
    'Minimum Quantity': consumable.minQuantity,
    'Status': consumable.quantity <= consumable.minQuantity ? 'Low Stock' : 'Good',
    'Location': consumable.location,
    'Item Number': consumable.itemNumber || ''
  }));
};

export const generateComponentReport = (components: any[]) => {
  return components.map(component => ({
    'Name': component.name,
    'Category': component.category,
    'Manufacturer': component.manufacturer,
    'Model': component.model,
    'Serial Number': component.serialNumber || '',
    'Quantity': component.quantity,
    'Location': component.location,
    'Purchase Date': component.purchaseDate,
    'Purchase Cost': component.purchaseCost
  }));
};

export const generateUserReport = (users: any[]) => {
  return users.map(user => ({
    'First Name': user.firstName,
    'Last Name': user.lastName,
    'Username': user.username,
    'Email': user.email,
    'Department': user.department,
    'Job Title': user.jobTitle,
    'Location': user.location,
    'Manager': user.manager || '',
    'Employee Number': user.employeeNumber || '',
    'Phone': user.phone || '',
    'Status': user.activated ? 'Active' : 'Inactive',
    'Last Login': user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'
  }));
};

export const generatePredefinedKitReport = (kits: any[], assets: any[], accessories: any[], licenses: any[], consumables: any[]) => {
  return kits.map(kit => ({
    'Kit Name': kit.name,
    'Category': kit.category,
    'Description': kit.description,
    'Assets Count': kit.assets.length,
    'Accessories Count': kit.accessories.length,
    'Licenses Count': kit.licenses.length,
    'Consumables Count': kit.consumables.length,
    'Total Items': kit.assets.length + kit.accessories.length + kit.licenses.length + kit.consumables.length,
    'Created Date': new Date(kit.createdDate).toLocaleDateString(),
    'Assets': kit.assets.map((id: string) => assets.find(a => a.id === id)?.name).filter(Boolean).join('; '),
    'Accessories': kit.accessories.map((id: string) => accessories.find(a => a.id === id)?.name).filter(Boolean).join('; '),
    'Licenses': kit.licenses.map((id: string) => licenses.find(l => l.id === id)?.name).filter(Boolean).join('; '),
    'Consumables': kit.consumables.map((id: string) => consumables.find(c => c.id === id)?.name).filter(Boolean).join('; ')
  }));
};

export const generateRequestableItemReport = (items: any[]) => {
  return items.map(item => ({
    'Name': item.name,
    'Category': item.category,
    'Description': item.description,
    'Available Quantity': item.quantity,
    'Location': item.location,
    'Requestable': item.requestable ? 'Yes' : 'No',
    'Notes': item.notes || ''
  }));
};