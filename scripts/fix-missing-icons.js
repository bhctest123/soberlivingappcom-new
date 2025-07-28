import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// List of existing icons we have
const existingIcons = [
  'admissions',
  'alumni', 
  'bed-management',
  'billing',
  'contacts',
  'connections',
  'dashboard',
  'employees',
  'file-storage',
  'housing',
  'mobile',
  'operations',
  'organizations',
  'portal',
  'properties',
  'scheduling',
  'security',
  'tasks',
  'test-results',
  'residents',
  'permissions',
  'organizations-vendors',
  'organizations-resources',
  'organizations-providers',
  'leads',
  'invoices',
  'housing-notes',
  'general-info',
  'communication-logs',
  'billing',
  'drug-test'
];

// Icon mapping for missing icons
const iconMapping = {
  'resident-profiles': 'residents',
  'emergency-contacts': 'contacts',
  'medical-info': 'residents',
  'document-storage': 'file-storage',
  'custom-fields': 'general-info',
  'data-security': 'security',
  'resource-database': 'organizations-resources',
  'smart-matching': 'organizations-resources',
  'resource-referrals': 'organizations-resources',
  'partnership-tracking': 'organizations-resources',
  'availability-updates': 'organizations-resources',
  'success-metrics': 'dashboard',
  'progress-notes': 'housing-notes',
  'incident-reports': 'housing-notes',
  'note-categories': 'housing-notes',
  'collaboration': 'housing-notes',
  'search-analytics': 'dashboard',
  'compliance-ready': 'security',
  'lead-management': 'admissions',
  'intake-workflow': 'admissions',
  'bed-availability': 'bed-management',
  'document-management': 'file-storage',
  'communication-hub': 'communication-logs',
  'analytics': 'dashboard',
  'digital-storage': 'file-storage',
  'automated-alerts': 'dashboard',
  'trend-analysis': 'dashboard',
  'lab-connection': 'test-results',
  'compliance-docs': 'security',
  'quick-search': 'dashboard',
  'admission-management': 'admissions',
  'program-tracking': 'residents',
  'care-coordination': 'residents',
  'discharge-planning': 'alumni',
  'compliance-monitoring': 'security',
  'payment-tracking': 'billing',
  'family-portal': 'portal',
  'performance-tracking': 'employees',
  'smart-invoicing': 'billing',
  'recurring-billing': 'billing',
  'custom-templates': 'billing',
  'payment-monitoring': 'billing',
  'automated-reminders': 'billing',
  'financial-reports': 'dashboard',
  'communication-history': 'communication-logs',
  'multi-channel': 'communication-logs',
  'staff-collaboration': 'communication-logs',
  'search-filter': 'dashboard',
  'follow-up': 'communication-logs',
  'compliance': 'security',
  'vendor-database': 'organizations-vendors',
  'vendor-contracts': 'organizations-vendors',
  'service-tracking': 'organizations-vendors',
  'performance-ratings': 'organizations-vendors',
  'cost-analysis': 'dashboard',
  'vendor-documents': 'file-storage',
  'alumni-portal': 'alumni',
  'recovery-navigation': 'alumni',
  'outcome-tracking': 'alumni',
  'relapse-intervention': 'alumni',
  'readmission': 'admissions',
  'schedule-management': 'scheduling',
  'result-tracking': 'test-results',
  'random-selection': 'drug-test',
  'lab-integration': 'test-results',
  'compliance-reports': 'security',
  'privacy-protection': 'security',
  'operational-status': 'dashboard',
  'analytics-dashboard': 'dashboard',
  'financial-metrics': 'dashboard',
  'occupancy-tracking': 'bed-management',
  'alert-management': 'dashboard',
  'provider-database': 'organizations-providers',
  'referral-tracking': 'organizations-providers',
  'contract-management': 'organizations-providers',
  'provider-communication': 'organizations-providers',
  'performance-metrics': 'dashboard',
  'automated-updates': 'organizations-providers',
  'property-overview': 'properties',
  'bed-assignment': 'bed-management',
  'occupancy-analytics': 'dashboard',
  'waiting-list': 'admissions',
  'room-maintenance': 'properties',
  'revenue-optimization': 'dashboard',
  'lead-capture': 'leads',
  'lead-scoring': 'leads',
  'automated-followup': 'leads',
  'pipeline-management': 'leads',
  'source-tracking': 'leads',
  'conversion-analytics': 'dashboard',
  'custom-roles': 'permissions',
  'granular-controls': 'permissions',
  'multi-property': 'permissions',
  'audit-logging': 'security',
  'permission-templates': 'permissions',
  'time-based-access': 'permissions'
};

async function fixMissingIcons() {
  console.log('🔧 Fixing missing SVG icon references...');
  
  // Find all markdown files in content/features
  const featureFiles = await glob('src/content/features/*.md');
  
  let fixedCount = 0;
  
  for (const file of featureFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    // Find all icon references
    const iconMatches = content.match(/icon: "\/images\/icons\/features\/([^"]+)\.svg"/g);
    
    if (iconMatches) {
      for (const match of iconMatches) {
        const iconName = match.match(/features\/([^"]+)\.svg/)[1];
        
        // If icon doesn't exist, replace with mapped icon or remove
        if (!existingIcons.includes(iconName)) {
          const replacementIcon = iconMapping[iconName] || 'dashboard';
          const newIconPath = `/images/icons/features/${replacementIcon}.png`;
          
          content = content.replace(match, `icon: "${newIconPath}"`);
          modified = true;
          console.log(`  📝 ${path.basename(file)}: ${iconName}.svg → ${replacementIcon}.png`);
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(file, content);
      fixedCount++;
    }
  }
  
  console.log(`✅ Fixed ${fixedCount} files with missing icon references`);
}

fixMissingIcons().catch(console.error); 