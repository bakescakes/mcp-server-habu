# AWS S3 Data Connection Tool - Implementation Plan

## Overview
Create a comprehensive MCP tool that guides users through the complete process of setting up a Client-Hosted AWS S3 data connection in LiveRamp Clean Room, following the official documentation workflow.

## 🎯 Tool Goals

1. **Guided Workflow**: Step-by-step process matching the official documentation
2. **Input Validation**: Ensure all inputs meet LiveRamp requirements
3. **Best Practice Coaching**: Provide tips and warnings throughout the process
4. **Error Handling**: Graceful fallback and helpful error messages
5. **Status Monitoring**: Track progress through the multi-step process

## 📋 Process Overview (from Documentation)

### Phase 1: Credential Management
1. **Add AWS IAM User Credentials**
   - Name (descriptive)
   - AWS Access Key ID
   - AWS Secret Access Key  
   - AWS User ARN
   - AWS Region

### Phase 2: Data Connection Setup
2. **Create Data Connection**
   - Select credentials
   - Configure connection parameters
   - Set up data location and schema
   - Validate connection

### Phase 3: Field Mapping
3. **Map Fields**
   - Configure queryable fields
   - Set PII flags
   - Define data types
   - Configure partitioning
   - Set user identifiers

## 🔧 API Endpoints Required

### Credentials Management
- `GET /organization-credentials` - List existing credentials
- `POST /organization-credentials` - Create new credentials  
- `GET /credential-sources` - Get available credential types
- `GET /credential-sources/credential-name/{name}` - Get AWS credential config

### Data Connections
- `GET /data-connections` - List existing connections
- `POST /data-connections` - Create new data connection
- `GET /data-connections/{id}` - Get connection details
- `PUT /data-connections/{id}` - Update connection
- `GET /data-connections/import-data-types` - Get available data types

### Field Configuration  
- `GET /data-connections/{id}/field-configurations` - Get field configs
- `POST /data-connections/{id}/field-configurations` - Configure fields

## 🎨 Tool Design

### Tool Name: `create_aws_s3_connection`

### Input Parameters
```typescript
{
  // Connection Details
  connectionName: string,           // Required: Name for the data connection
  category: string,                // Required: Category (e.g., "Customer Data") 
  
  // AWS Credentials (will create new or use existing)
  credentialName?: string,         // Optional: Name for new credential
  awsAccessKeyId?: string,         // Optional: For new credential
  awsSecretAccessKey?: string,     // Optional: For new credential  
  awsUserArn?: string,            // Optional: For new credential
  awsRegion?: string,             // Optional: For new credential
  existingCredentialId?: string,   // Optional: Use existing credential instead
  
  // Data Location Configuration
  s3BucketPath: string,           // Required: S3 bucket location
  fileFormat: 'CSV' | 'Parquet' | 'Delta', // Required: File format
  sampleFilePath?: string,        // Optional: Sample file for schema inference
  
  // CSV-specific options
  quoteCharacter?: string,        // Optional: Quote character for CSV
  fieldDelimiter?: 'comma' | 'semicolon' | 'pipe' | 'tab', // Optional: CSV delimiter
  
  // Partitioning
  usesPartitioning?: boolean,     // Optional: Enable partitioning
  
  // Advanced options
  autoMapFields?: boolean,        // Optional: Automatically map fields (default: true)
  skipValidation?: boolean,       // Optional: Skip validation steps
  dryRun?: boolean               // Optional: Validate inputs without creating
}
```

## 🚀 Implementation Steps

### Step 1: Input Validation & Best Practices
- Validate S3 bucket path format (must start with s3:// and end with /)
- Check for proper Hive-style date formatting hints
- Validate AWS credential format
- Check file format consistency
- Provide warnings about bucket path uniqueness

### Step 2: Credential Management
- Check if `existingCredentialId` provided, use that
- If not, create new AWS IAM User Credential:
  - Get AWS credential source configuration
  - Create credential with provided AWS details
  - Validate credential creation

### Step 3: Data Connection Creation
- Prepare data connection payload with all parameters
- Map file format to internal format codes
- Set up job parameters for S3 configuration
- Create data connection via API
- Monitor connection status ("Verifying Access" → "Mapping Required")

### Step 4: Field Mapping (Optional Auto-mapping)
- Get field configurations from created connection
- If `autoMapFields=true`:
  - Apply sensible defaults (include all fields, detect common PII patterns)
  - Set appropriate data types based on sample data
  - Configure partitioning for date fields if enabled
- If `autoMapFields=false`, provide field mapping guidance

### Step 5: Status Monitoring & Completion
- Monitor connection status transitions
- Provide status updates and next steps
- Return connection details and provisioning guidance

## 📝 User Experience Flow

### Interactive Mode
```
🔗 AWS S3 Data Connection Setup

Step 1/4: Connection Details
✓ Connection Name: "Customer Purchase Data"
✓ Category: "Transactional Data"
✓ File Format: CSV

Step 2/4: AWS Credentials  
? Use existing credential or create new?
✓ Creating new credential: "Purchase Data S3 Access"
✓ AWS Region: us-east-1
✓ Credential validation: ✅ PASSED

Step 3/4: Data Location
✓ S3 Bucket: s3://customer-data-bucket/purchase_events/date=yyyy-MM-dd/
✓ Sample File: s3://customer-data-bucket/purchase_events/sample.csv
✓ Partitioning: Enabled (date-based)
✓ Path validation: ✅ PASSED

Step 4/4: Field Mapping
✓ Auto-mapping: Enabled
✓ Detected fields: 12 (8 queryable, 2 PII, 2 partitioning)
✓ Field configuration: ✅ COMPLETED

🎉 Data Connection Created Successfully!
   ID: dc-12345-67890
   Status: Completed
   Next: Provision to Clean Rooms
```

## ⚠️ Validation Rules & Best Practices

### S3 Path Validation
- Must start with "s3://" and end with "/"
- Should use Hive-style partitioning: date=yyyy-MM-dd
- Must be distinct from export destination paths
- Sample file must exist and be < 7 days old

### File Format Requirements
- CSV: Must have headers, no spaces/special chars, max 50 char headers
- Headers can use underscores instead of spaces
- Avoid double quotes in CSV data

### Security Best Practices
- Validate AWS credentials have minimal required permissions
- Check for IP allowlisting requirements
- Warn about credential security

### Field Mapping Intelligence
- Auto-detect PII fields (email, phone, name patterns)
- Suggest partitioning for date/timestamp fields
- Recommend queryable vs non-queryable field classification

## 🛠️ Error Handling

### Common Error Scenarios
1. **Invalid AWS Credentials**: Provide credential troubleshooting
2. **S3 Access Denied**: Check permissions and allowlisting
3. **File Not Found**: Validate sample file path and upload status
4. **Schema Inference Failed**: Provide manual field mapping guidance
5. **Connection Timeout**: Monitor status and provide wait guidance

### Graceful Degradation
- If API calls fail, provide manual setup instructions
- If auto-mapping fails, fall back to guided mapping
- If validation fails, provide detailed error explanation

## 📊 Success Metrics

### Completion Indicators
- ✅ Credential created and validated
- ✅ Data connection status: "Completed"  
- ✅ Field mapping configured
- ✅ Connection ready for provisioning

### User Guidance
- Provide next steps for dataset provisioning
- Link to clean room assignment process
- Suggest analysis rules configuration

## 🔄 Future Enhancements

### Advanced Features
- Batch connection creation for multiple buckets
- Template-based configuration for common patterns
- Integration with clean room provisioning workflow
- Automated field mapping learning from previous connections

### Monitoring & Maintenance
- Connection health monitoring
- Data freshness validation
- Performance optimization suggestions
- Cost optimization recommendations

---

This tool will provide a comprehensive, user-friendly way to create AWS S3 data connections while ensuring best practices and handling the complexity of the multi-step process.