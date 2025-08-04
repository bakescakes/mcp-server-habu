# 🔧 BigQuery Data Connection Tool Development Plan

## 🎯 **Objective**
Create a new MCP tool `create_bigquery_connection_wizard` for direct BigQuery table connections to the Habu Clean Room API.

## 📋 **Requirements Analysis**

### **From Documentation:**
1. **Connection Types**: Google Cloud BigQuery or Google Cloud Authorized View
2. **Required Fields**:
   - Connection Name
   - Category (e.g., "Customer Data")
   - Dataset Type (Generic)
   - Project ID
   - Source Dataset
   - Source Table
   - Temporary Dataset (for partitioning)
   - Uses Partitioning toggle
   - Credential ID (Google Service Account)

### **From API Specification:**
- **Endpoint**: POST `/data-connections`
- **Required Schema**: `DataConnectionDetails`
- **Key Fields**: name, category, credentialId, dataType, dataSource, dataSourceConfiguration

## 🛠️ **Tool Design**

### **Tool Name**: `create_bigquery_connection_wizard`

### **Input Parameters**:
```typescript
{
  connectionName: string,           // Required
  category: string,                // Required  
  projectId: string,               // Required
  sourceDataset: string,           // Required
  sourceTable: string,             // Required
  temporaryDataset: string,        // Required for partitioning
  usesPartitioning: boolean,       // Optional (default: false)
  connectionType: enum,            // "bigquery" | "authorized_view" (default: "bigquery")
  serviceAccountKey: string,       // Required - JSON key from secrets
  step: enum                       // Wizard steps: start, connection_info, authentication, database_config, validation, creation
}
```

### **API Mapping**:
- **dataSource.displayName**: "Google Cloud Big Query" or "Google Cloud Authorized View"
- **dataSourceConfiguration**: Array of JobParameters for BigQuery-specific config
- **credentialId**: Created/retrieved credential ID

### **Wizard Steps**:
1. **start** - Introduction and overview
2. **connection_info** - Name and category
3. **authentication** - Service account setup
4. **database_config** - Project, dataset, table configuration  
5. **validation** - Preview configuration
6. **creation** - Execute API calls

## 🔧 **Implementation Steps**

### **Step 1**: Add tool definition to MCP server
### **Step 2**: Implement wizard logic with step-by-step flow
### **Step 3**: Add service account credential creation
### **Step 4**: Implement BigQuery-specific API call construction
### **Step 5**: Add error handling and validation
### **Step 6**: Test with real API

## 🧪 **Testing Plan**
1. Test wizard flow progression
2. Test service account credential creation
3. Test BigQuery connection creation with real data
4. Test error scenarios and validation

## 📝 **Documentation Updates**
- Update README.md with new tool
- Document BigQuery connection requirements
- Add example usage scenarios

---

**Status**: Ready for implementation
**Next**: Begin Step 1 - Add tool definition