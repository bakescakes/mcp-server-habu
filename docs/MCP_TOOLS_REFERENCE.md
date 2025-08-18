# 🔧 Habu MCP Server - Complete Tools Reference

**Date**: January 17, 2025  
**Version**: Production v1.0  
**Total Tools**: 45 (verified from live MCP server)  

This document provides a human-readable overview of every tool available in the Habu MCP Server, organized by category and function.

---

## 📊 **Tool Categories Overview**

| Category | Tools | Purpose |
|----------|-------|---------|
| **Foundation** | 8 tools | Authentication, discovery, basic operations |
| **Clean Room Management** | 4 tools | Create, configure, monitor clean rooms |
| **Data Connections** | 14 tools | Multi-cloud data integration wizards |
| **Partner Collaboration** | 4 tools | Invitations, permissions, onboarding |
| **Question Management** | 4 tools | Deploy, configure, execute analytics |
| **Dataset Management** | 4 tools | Provision datasets, configure access |
| **Results & Monitoring** | 4 tools | Access results, monitor execution |
| **Advanced Features** | 3 tools | Export, templates, user management |

---

## 🏗️ **Foundation Tools** (8 tools)

### 1. **test_connection**
**Purpose**: Validate OAuth2 authentication and API connectivity  
**How it works**: Tests your API credentials and returns connection status  
**Input**: None required  
**Output**: Authentication status, available resources, cleanroom counts  
**Use when**: Setting up the server, troubleshooting connections  

### 2. **list_cleanrooms**
**Purpose**: Discover all cleanrooms in your organization  
**How it works**: Retrieves comprehensive list with status and metadata  
**Input**: None required  
**Output**: Cleanroom names, Display IDs, status, creation dates  
**Use when**: Finding cleanrooms to work with, checking availability  

### 3. **list_questions**
**Purpose**: Browse questions available in a specific cleanroom  
**How it works**: Accepts cleanroom name/ID, returns all associated questions  
**Input**: Cleanroom identifier (name, Display ID, or UUID)  
**Output**: Question names, types, descriptions, complexity levels  
**Use when**: Exploring analytics options, planning question deployment  

### 4. **list_credentials**
**Purpose**: View all available organization credentials  
**How it works**: Lists AWS, GCP, Azure, and other stored credentials  
**Input**: None required  
**Output**: Credential names, types, sources, managed status  
**Use when**: Setting up data connections, checking available credentials  

### 5. **list_data_connections**
**Purpose**: Inventory all data connections in your organization  
**How it works**: Comprehensive listing with configuration status  
**Input**: None required  
**Output**: Connection names, types, status, categories, sources  
**Use when**: Planning data integration, checking connection health  

### 6. **configure_data_connection_fields**
**Purpose**: Set up field mappings for data connections  
**How it works**: Applies intelligent PII detection and field configuration  
**Input**: Connection name/ID, optional configuration flags  
**Output**: Field analysis, PII detection results, mapping configuration  
**Use when**: Connections are in "Mapping Required" status  

### 7. **complete_data_connection_setup**
**Purpose**: Automate entire data connection setup workflow  
**How it works**: Monitors status, applies field mapping when ready  
**Input**: Connection name/ID, configuration options  
**Output**: Complete setup progress, final configuration status  
**Use when**: Finishing data connection after initial creation  

### 8. **create_aws_s3_connection**
**Purpose**: Create AWS S3 data connections with full automation  
**How it works**: Handles credentials, validation, field mapping  
**Input**: Connection details, S3 path, file format, credentials  
**Output**: Complete S3 connection ready for use  
**Use when**: Setting up new AWS S3 data sources  

---

## 🏢 **Clean Room Management** (4 tools)

### 9. **start_clean_room_creation_wizard**
**Purpose**: Guided clean room creation with step-by-step configuration  
**How it works**: 7-step interactive wizard from basic info to creation  
**Input**: Progressive configuration through wizard steps  
**Output**: Fully configured clean room ready for collaboration  
**Use when**: Creating new clean rooms with proper setup  

### 10. **update_cleanroom_configuration**
**Purpose**: Modify clean room settings and parameters  
**How it works**: Updates configuration with validation and impact analysis  
**Input**: Cleanroom ID, configuration updates, validation options  
**Output**: Updated configuration, validation results  
**Use when**: Changing privacy settings, features, or timeframes  

### 11. **cleanroom_health_monitoring**
**Purpose**: Monitor clean room status, usage, and performance  
**How it works**: Generates comprehensive health reports and metrics  
**Input**: Cleanroom ID, time range, metric options  
**Output**: Health status, performance metrics, usage analytics  
**Use when**: Troubleshooting issues, performance optimization  

### 12. **cleanroom_lifecycle_manager**
**Purpose**: Handle clean room archival, reactivation, and cleanup  
**How it works**: Compliance-aware lifecycle operations with data preservation  
**Input**: Cleanroom ID, lifecycle action, confirmation  
**Output**: Lifecycle status, preservation confirmation  
**Use when**: Project completion, archival, or cleanup operations  

---

## 🔗 **Data Connection Wizards** (14 tools)

### 13. **start_aws_s3_connection_wizard**
**Purpose**: Interactive wizard for AWS S3 data connections  
**How it works**: Multi-step guided setup with batch processing support  
**Input**: Progressive configuration through wizard steps  
**Output**: One or more configured AWS S3 connections  
**Use when**: Setting up multiple S3 connections with guided assistance  

### 14. **create_bigquery_connection_wizard**
**Purpose**: Interactive BigQuery data connection setup  
**How it works**: Step-by-step authentication and table configuration  
**Input**: GCP credentials, project details, table information  
**Output**: Configured BigQuery connection with field mapping  
**Use when**: Integrating Google BigQuery data sources  

### 15. **create_snowflake_connection_wizard**
**Purpose**: Interactive Snowflake data connection with performance tuning  
**How it works**: Authentication, database config, performance optimization  
**Input**: Snowflake credentials, warehouse details, performance settings  
**Output**: Optimized Snowflake connection ready for analytics  
**Use when**: Connecting to Snowflake data warehouses  

### 16. **create_databricks_connection_wizard**
**Purpose**: Interactive Databricks connection with Delta Lake support  
**How it works**: Cluster configuration, Delta Lake setup, performance tuning  
**Input**: Databricks workspace URL, access tokens, cluster configuration  
**Output**: Databricks connection with Delta Lake optimization  
**Use when**: Integrating Databricks and Delta Lake data sources  

### 17. **create_gcs_connection_wizard**
**Purpose**: Interactive Google Cloud Storage with BigQuery integration  
**How it works**: IAM configuration, bucket setup, BigQuery integration  
**Input**: GCP service account, bucket details, BigQuery options  
**Output**: GCS connection with optional BigQuery integration  
**Use when**: Connecting Google Cloud Storage data sources  

### 18. **create_azure_connection_wizard**
**Purpose**: Interactive Azure data connection with Synapse integration  
**How it works**: Azure AD authentication, storage config, Synapse setup  
**Input**: Azure credentials, storage account, container details  
**Output**: Azure connection with Synapse integration options  
**Use when**: Integrating Microsoft Azure data sources  

### 19. **create_google_ads_data_hub_wizard**
**Purpose**: Interactive Google Ads Data Hub connection setup  
**How it works**: OAuth2 authentication, ADH project configuration  
**Input**: Google credentials, ADH project ID, access permissions  
**Output**: Google Ads Data Hub connection for marketing analytics  
**Use when**: Accessing Google Ads campaign and audience data  

### 20. **create_amazon_marketing_cloud_wizard**
**Purpose**: Interactive Amazon Marketing Cloud (AMC) connection setup  
**How it works**: Amazon Advertising API authentication, AMC instance setup  
**Input**: Amazon credentials, AMC instance, AWS integration details  
**Output**: AMC connection for Amazon advertising analytics  
**Use when**: Accessing Amazon Marketing Cloud campaign data  

### 21. **create_snowflake_data_share_wizard**
**Purpose**: Interactive Snowflake Data Share connection setup  
**How it works**: Cross-account sharing configuration, access controls  
**Input**: Snowflake credentials, data share details, access permissions  
**Output**: Secure Snowflake data share connection  
**Use when**: Accessing shared Snowflake datasets from partners  

### 22. **create_snowflake_secure_views_wizard**
**Purpose**: Interactive Snowflake Secure Views with privacy controls  
**How it works**: Secure view configuration, data masking, privacy controls  
**Input**: Snowflake credentials, secure view details, masking policies  
**Output**: Secure view connection with privacy protection  
**Use when**: Accessing privacy-protected Snowflake data  

### 23. **create_hubspot_connection_wizard**
**Purpose**: Interactive HubSpot CRM data connection setup  
**How it works**: OAuth2 authentication, portal configuration, object mapping  
**Input**: HubSpot credentials, portal ID, object permissions  
**Output**: HubSpot CRM connection for customer data analytics  
**Use when**: Integrating HubSpot CRM data for customer insights  

### 24. **create_salesforce_connection_wizard**
**Purpose**: Interactive Salesforce CRM data connection setup  
**How it works**: OAuth2 authentication, organization setup, object permissions  
**Input**: Salesforce credentials, organization ID, access permissions  
**Output**: Salesforce CRM connection for sales analytics  
**Use when**: Integrating Salesforce data for sales and marketing insights  

### 25. **data_connection_health_monitor**
**Purpose**: Monitor data connection status across multiple cloud providers  
**How it works**: Health checks, performance metrics, automated alerting  
**Input**: Optional connection ID, time range, metric options  
**Output**: Connection health status, performance metrics, alerts  
**Use when**: Troubleshooting connections, monitoring data pipeline health  

### 26. **cleanroom_access_audit**
**Purpose**: Track user access and activity logs with audit reporting  
**How it works**: Comprehensive audit reporting, security incident detection  
**Input**: Cleanroom ID, time range, user filters  
**Output**: Access logs, activity reports, security event analysis  
**Use when**: Compliance auditing, security monitoring, access review  

---

## 🤝 **Partner Collaboration** (4 tools)

### 27. **invite_partner_to_cleanroom**
**Purpose**: Send partner invitations with guided setup and validation  
**How it works**: Email validation, role assignment, self-invitation support  
**Input**: Cleanroom ID, partner email, role, invitation message  
**Output**: Invitation status, setup guidance, next steps  
**Use when**: Adding partners to clean rooms for collaboration  

### 28. **manage_partner_invitations**
**Purpose**: View, cancel, resend invitations with status tracking  
**How it works**: Comprehensive invitation management and monitoring  
**Input**: Cleanroom ID, action (list/cancel/resend), invitation details  
**Output**: Invitation history, status updates, management options  
**Use when**: Managing pending invitations, following up with partners  

### 29. **configure_partner_permissions**
**Purpose**: Set granular access controls and question permissions  
**How it works**: Role-based permissions, question-level controls, impact analysis  
**Input**: Cleanroom ID, partner ID, permission templates  
**Output**: Permission configuration, access control settings  
**Use when**: Setting up partner access, configuring collaboration rules  

### 30. **partner_onboarding_wizard**
**Purpose**: Step-by-step partner setup guidance and coordination  
**How it works**: Multi-partner onboarding with progress tracking  
**Input**: Cleanroom ID, partner details, onboarding template  
**Output**: Onboarding progress, setup validation, activation status  
**Use when**: Coordinating complex partner onboarding workflows  

---

## 📊 **Question Management** (4 tools)

### 31. **deploy_question_to_cleanroom**
**Purpose**: Deploy analytical questions with dataset mapping and permissions  
**How it works**: Question provisioning, dataset mapping, parameter configuration  
**Input**: Cleanroom ID, question ID, dataset mappings, parameters  
**Output**: Deployed question, mapping configuration, permission settings  
**Use when**: Adding analytics questions to clean rooms  

### 32. **question_management_wizard**
**Purpose**: Interactive question deployment and configuration guide  
**How it works**: 6-step workflow for question setup and validation  
**Input**: Progressive configuration through wizard steps  
**Output**: Fully configured question ready for execution  
**Use when**: Setting up complex analytical questions with guidance  

### 33. **manage_question_permissions**
**Purpose**: Configure question-specific permissions and access controls  
**How it works**: Granular partner-specific controls, permission templates  
**Input**: Cleanroom ID, question ID, partner permissions  
**Output**: Question permission configuration, access control settings  
**Use when**: Setting up question access, controlling analytics visibility  

### 34. **question_scheduling_wizard**
**Purpose**: Set up automated question runs with parameters and scheduling  
**How it works**: Recurring execution setup, monitoring, result delivery  
**Input**: Cleanroom ID, question ID, schedule configuration  
**Output**: Automated execution schedule, monitoring setup  
**Use when**: Setting up recurring analytics, automated reporting  

---

## 📂 **Dataset Management** (4 tools)

### 35. **provision_dataset_to_cleanroom**
**Purpose**: Add datasets to clean rooms with field control and configuration  
**How it works**: Dataset access setup, field visibility, security controls  
**Input**: Cleanroom ID, dataset ID, access controls, visibility settings  
**Output**: Provisioned dataset, access configuration, security settings  
**Use when**: Making datasets available for analytics in clean rooms  

### 36. **dataset_configuration_wizard**
**Purpose**: Interactive wizard to map datasets to questions  
**How it works**: Dataset assignment, field mapping, macro configuration  
**Input**: Cleanroom ID, dataset ID, question mapping  
**Output**: Dataset-question mapping, field configuration  
**Use when**: Setting up data sources for specific analytical questions  

### 37. **manage_dataset_permissions**
**Purpose**: Control dataset access and field visibility  
**How it works**: Partner access configuration, field-level controls  
**Input**: Cleanroom ID, dataset ID, partner permissions  
**Output**: Dataset permission configuration, field access controls  
**Use when**: Setting up data access rules, controlling data visibility  

### 38. **dataset_transformation_wizard**
**Purpose**: Apply transformations and create derived fields  
**How it works**: Data transformation, field creation, dataset preparation  
**Input**: Cleanroom ID, dataset ID, transformation configuration  
**Output**: Transformed dataset, derived fields, preparation results  
**Use when**: Preparing data for analytics, creating computed fields  

---

## 📈 **Results & Monitoring** (4 tools)

### 39. **execute_question_run**
**Purpose**: Execute question runs with intelligent parameter detection  
**How it works**: Smart partition parameter detection, execution monitoring  
**Input**: Cleanroom ID, question ID, parameters, partition settings  
**Output**: Question run status, execution details, monitoring information  
**Use when**: Running analytics questions, generating insights  

### 40. **check_question_run_status**
**Purpose**: Check current status of question runs with execution details  
**How it works**: Point-in-time status reports, completion monitoring  
**Input**: Cleanroom ID, optional run IDs, monitoring options  
**Output**: Run status, progress updates, completion details  
**Use when**: Monitoring question execution, checking run progress  

### 41. **results_access_and_export**
**Purpose**: Retrieve, format, and export question results  
**How it works**: Multi-format output, advanced filtering, export options  
**Input**: Cleanroom ID, run ID, format options, filter criteria  
**Output**: Formatted results, export files, analysis data  
**Use when**: Accessing analytics results, preparing reports  

### 42. **scheduled_run_management**
**Purpose**: Manage recurring question executions  
**How it works**: Schedule management, monitoring, optimization  
**Input**: Cleanroom ID, schedule actions, configuration  
**Output**: Schedule status, execution history, management options  
**Use when**: Managing automated analytics, optimizing recurring runs  

---

## 🚀 **Advanced Features** (3 tools)

### 43. **data_export_workflow_manager**
**Purpose**: Complete data export job lifecycle management  
**How it works**: Multi-destination export, monitoring, secure delivery  
**Input**: Cleanroom ID, export configuration, destination settings  
**Output**: Export job status, delivery confirmation, security reports  
**Use when**: Exporting results to external systems, secure data delivery  

### 44. **execution_template_manager**
**Purpose**: Create and execute reusable execution templates  
**How it works**: Multi-question orchestration, workflow automation  
**Input**: Template configuration, execution parameters, workflow settings  
**Output**: Template execution results, workflow status, automation reports  
**Use when**: Automating complex analytical workflows, standardizing processes  

### 45. **advanced_user_management**
**Purpose**: Bulk user operations, role management, enterprise administration  
**How it works**: Bulk operations, permission analysis, user lifecycle management  
**Input**: Cleanroom ID, user operations, role configurations  
**Output**: User management results, permission reports, audit information  
**Use when**: Enterprise user administration, bulk access management  

---

## 🎯 **Tool Selection Guidelines**

### **For First-Time Setup**:
1. `test_connection` - Verify API access
2. `list_cleanrooms` - Discover available clean rooms
3. `create_aws_s3_connection` - Set up data sources
4. `start_clean_room_creation_wizard` - Create clean rooms

### **For Partner Collaboration**:
1. `invite_partner_to_cleanroom` - Add partners
2. `configure_partner_permissions` - Set access controls
3. `partner_onboarding_wizard` - Coordinate setup

### **For Analytics**:
1. `list_questions` - Browse available questions
2. `deploy_question_to_cleanroom` - Add questions
3. `execute_question_run` - Run analytics
4. `results_access_and_export` - Access results

### **For Automation**:
1. `question_scheduling_wizard` - Set up recurring runs
2. `execution_template_manager` - Create workflow templates
3. `data_export_workflow_manager` - Automate result delivery

---

**This reference guide covers all 45 production tools currently live in your Habu MCP Server. Each tool is production-tested and ready for immediate use.**