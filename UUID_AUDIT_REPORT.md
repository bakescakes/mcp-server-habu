# 🔍 UUID Parameter Audit: Habu MCP Server Tools

**Date**: January 17, 2025  
**Objective**: Identify all tools requiring UUIDs instead of human-readable names  
**Total Tools**: 36 tools analyzed

## 🚨 HIGH PRIORITY: Tools Requiring Name-Based Enhancement (28 tools)

### Foundation Tools Needing Enhancement (3 tools)
1. **`list_questions`**
   - **Issue**: Requires `cleanroom_id` (UUID)
   - **Fix**: Add cleanroom name lookup → ID resolution

2. **`complete_data_connection_setup`**
   - **Issue**: Requires `connectionId` (UUID)
   - **Fix**: Add connection name lookup → ID resolution

### Partner Collaboration Tools (4 tools)
3. **`invite_partner_to_cleanroom`**
   - **Issue**: Requires `cleanroomId` (UUID)
   - **Fix**: Add cleanroom name lookup → ID resolution

4. **`manage_partner_invitations`**
   - **Issue**: Requires `cleanroomId` (UUID), optional `invitationId`
   - **Fix**: Add cleanroom name lookup, invitation lookup by email

5. **`configure_partner_permissions`**
   - **Issue**: Requires `cleanroomId` (UUID), optional `partnerId`
   - **Fix**: Add cleanroom name + partner email/name lookup

6. **`partner_onboarding_wizard`**
   - **Issue**: Requires `cleanroomId` (UUID)
   - **Fix**: Add cleanroom name lookup → ID resolution

### Question Management Tools (4 tools)
7. **`deploy_question_to_cleanroom`**
   - **Issue**: Requires `cleanroomId` + `questionId` (UUIDs)
   - **Fix**: Add cleanroom name + question name lookup

8. **`question_management_wizard`**
   - **Issue**: Requires `cleanroomId` (UUID), optional `questionId`
   - **Fix**: Add cleanroom name + question name lookup

9. **`manage_question_permissions`**
   - **Issue**: Requires `cleanroomId` + `questionId` (UUIDs)
   - **Fix**: Add cleanroom name + question name lookup

10. **`question_scheduling_wizard`**
    - **Issue**: Requires `cleanroomId` + `questionId` (UUIDs)
    - **Fix**: Add cleanroom name + question name lookup

### Dataset Management Tools (4 tools)
11. **`provision_dataset_to_cleanroom`**
    - **Issue**: Requires `cleanroomId` + `datasetId` (UUIDs)
    - **Fix**: Add cleanroom name + dataset name lookup

12. **`dataset_configuration_wizard`**
    - **Issue**: Requires `cleanroomId` + `datasetId` (UUIDs)
    - **Fix**: Add cleanroom name + dataset name lookup

13. **`manage_dataset_permissions`**
    - **Issue**: Requires `cleanroomId` + `datasetId` (UUIDs)
    - **Fix**: Add cleanroom name + dataset name lookup

14. **`dataset_transformation_wizard`**
    - **Issue**: Requires `cleanroomId` + `datasetId` (UUIDs)
    - **Fix**: Add cleanroom name + dataset name lookup

### Execution & Results Tools (4 tools)
15. **`execute_question_run`**
    - **Issue**: Requires `cleanroomId` + `questionId` (UUIDs)
    - **Fix**: Add cleanroom name + question name lookup

16. **`check_question_run_status`**
    - **Issue**: Requires `cleanroomId` (UUID), optional `runIds`
    - **Fix**: Add cleanroom name lookup

17. **`results_access_and_export`**
    - **Issue**: Requires `cleanroomId` + `runId` (UUIDs)
    - **Fix**: Add cleanroom name + run name/date lookup

18. **`scheduled_run_management`**
    - **Issue**: Requires `cleanroomId` (UUID), optional `questionId`, `scheduleId`
    - **Fix**: Add cleanroom name + question name + schedule name lookup

### Lifecycle Management Tools (4 tools)
19. **`update_cleanroom_configuration`**
    - **Issue**: Requires `cleanroomId` (UUID)
    - **Fix**: Add cleanroom name lookup → ID resolution

20. **`cleanroom_health_monitoring`**
    - **Issue**: Requires `cleanroomId` (UUID)
    - **Fix**: Add cleanroom name lookup → ID resolution

21. **`cleanroom_lifecycle_manager`**
    - **Issue**: Requires `cleanroomId` (UUID)
    - **Fix**: Add cleanroom name lookup → ID resolution

22. **`cleanroom_access_audit`**
    - **Issue**: Requires `cleanroomId` (UUID)
    - **Fix**: Add cleanroom name lookup → ID resolution

### Multi-Cloud Tools (1 tool)
23. **`data_connection_health_monitor`**
    - **Issue**: Optional `connectionId` (UUID)
    - **Fix**: Add connection name lookup → ID resolution

### Enterprise Tools (3 tools)
24. **`data_export_workflow_manager`**
    - **Issue**: Requires `cleanroomId` (UUID), optional `jobId`, `questionRunId`
    - **Fix**: Add cleanroom name + job name/run name lookup

25. **`execution_template_manager`**
    - **Issue**: Requires `cleanroomId` (UUID), optional `templateId`, `executionId`
    - **Fix**: Add cleanroom name + template name + execution name lookup

26. **`advanced_user_management`**
    - **Issue**: Requires `cleanroomId` (UUID), optional `userId`, `partnerId`, `roleId`
    - **Fix**: Add cleanroom name + user email + partner name + role name lookup

## ✅ GOOD: Tools Already Supporting Names or No Enhancement Needed (8 tools)

### Already Enhanced (1 tool)
1. **`configure_data_connection_fields`** ✅
   - **Status**: Enhanced with name lookup support
   - **Supports**: Connection names → ID resolution

### No IDs Required (2 tools)
2. **`test_connection`** ✅
   - **Status**: No enhancement needed - tests authentication only

3. **`list_cleanrooms`** ✅
   - **Status**: No enhancement needed - lists all cleanrooms

### Creation Tools (5 tools) - Create new entities, so names are inputs not lookups
4. **`create_aws_s3_connection`** ✅
   - **Status**: Creates new connections with user-provided names

5. **`start_aws_s3_connection_wizard`** ✅
   - **Status**: Creates new connections with user-provided names

6. **`start_clean_room_creation_wizard`** ✅
   - **Status**: Creates new cleanrooms with user-provided names

7. **`create_snowflake_connection_wizard`** ✅
   - **Status**: Creates new connections with user-provided names

8. **`create_databricks_connection_wizard`** ✅
   - **Status**: Creates new connections with user-provided names

9. **`create_gcs_connection_wizard`** ✅
   - **Status**: Creates new connections with user-provided names

10. **`create_azure_connection_wizard`** ✅
    - **Status**: Creates new connections with user-provided names

## 📊 Enhancement Priority Matrix

### 🔴 Critical (Most Commonly Used)
- **Clean Room Operations**: All tools requiring `cleanroomId` (22 tools)
- **Question Management**: All tools requiring `questionId` (6 tools)

### 🟡 Important (Frequently Used)
- **Data Connections**: Tools requiring `connectionId` (2 tools remaining)
- **Dataset Operations**: Tools requiring `datasetId` (4 tools)

### 🟢 Nice-to-Have (Administrative)
- **User Management**: Tools requiring `userId`, `partnerId`, `roleId`
- **Advanced Features**: Template IDs, execution IDs, job IDs

## 🛠️ Implementation Strategy

### Phase 1: Core Infrastructure (Cleanroom + Question Names)
Implement name lookup for the two most common ID types:
1. **Cleanroom Name → ID**: Used by 22 tools
2. **Question Name → ID**: Used by 6 tools

### Phase 2: Data Operations (Connections + Datasets)
3. **Connection Name → ID**: Used by 2 remaining tools
4. **Dataset Name → ID**: Used by 4 tools

### Phase 3: Advanced Features
5. **Run/Template/Job Names**: Used by specialized tools

## 🎯 Recommended Action Plan

**Immediate Focus**: Enhance the 28 tools requiring UUID parameters with name-based lookup functionality, starting with the most commonly used ID types (cleanroom and question names).

**Success Pattern**: Follow the same enhancement pattern used for `configure_data_connection_fields`:
1. Detect UUID vs name format
2. Add API call to lookup by name if needed
3. Use resolved ID for subsequent API operations
4. Update parameter descriptions and examples