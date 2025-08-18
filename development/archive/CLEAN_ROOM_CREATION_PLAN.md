# Clean Room Creation Wizard - Implementation Plan

## 🎯 **Overview**
Create an interactive MCP tool that guides users through the clean room creation process step-by-step, mirroring the successful design principles of our AWS S3 connection wizard.

## 📋 **Requirements Analysis**

### **From LiveRamp Documentation:**
1. **Clean Room Type Selection**: Hybrid, Snowflake (Primary focus: Hybrid for walled gardens)
2. **Configuration Step**: Name, description, start/end dates, cloud, region
3. **Parameters Step**: Data control parameters (Data Decibel, Crowd Size)
4. **Additional Features**: Enable Intelligence, Enable Exports
5. **Question Permissions**: Define partner permissions for questions
6. **Final Review**: Confirm settings before creation

### **From API Specification:**
```typescript
CleanRoomRequest {
  name: string (required)
  description: string 
  startAt: string (required, format: yyyy-mm-dd)
  endAt: string (optional, format: yyyy-mm-dd)
  type: "Hybrid" | "Snowflake" (required)
  parameters: {
    REGION: "REGION_EU" | "REGION_US" | "REGION_APAC" | "REGION_AFRICA"
    SUB_REGION: "SUB_REGION_EAST1" | "SUB_REGION_WEST1" | etc.
    CLOUD: "CLOUD_AWS" | "CLOUD_GCP" | "CLOUD_AZURE"
    ENABLE_EXPORT: "true" | "false"
    ENABLE_VIEW_QUERY: "true" | "false" 
    ENABLE_HABU_INTELLIGENCE: "true" | "false"
    ENABLE_PAIR: "true" | "false"
    ENABLE_OPJA: "true" | "false"
    DATA_DECIBEL: string (privacy noise level)
    CROWD_SIZE: string (k-minimum threshold)
  }
}
```

## 🎛️ **Wizard Architecture**

### **Design Principles** (Following AWS S3 Wizard Success):
- ✅ **Progressive Steps**: Break complex process into digestible steps
- ✅ **Guided Experience**: Provide context and recommendations at each step
- ✅ **Smart Defaults**: Offer sensible defaults with ability to customize
- ✅ **Validation**: Real-time input validation and conflict detection  
- ✅ **Review Phase**: Clear summary before creation
- ✅ **Error Handling**: Graceful handling of API failures

### **Wizard Steps:**

#### **Step 1: start**
- Welcome and overview
- Explain clean room creation process
- Check authentication status
- Prompt to begin or exit

#### **Step 2: basic_info** 
- **Clean Room Name**: Required, validate uniqueness
- **Description**: Optional but recommended
- **Clean Room Type**: Hybrid (default) or Snowflake
- **Start Date**: Required (format: YYYY-MM-DD)
- **End Date**: Optional (format: YYYY-MM-DD)
- **Validation**: Date logic, name format, type compatibility

#### **Step 3: infrastructure**
- **Cloud Provider**: AWS (default), GCP, or Azure
- **Region Selection**: Based on cloud provider
  - AWS: US, UAE
  - GCP: US, APAC, EU  
  - Azure: Various regions
- **Sub-Region**: Specific sub-region within main region
- **Recommendations**: Suggest based on data location, compliance needs

#### **Step 4: privacy_controls**
- **Data Decibel**: Privacy noise level (with explanation)
- **Crowd Size**: K-minimum threshold (with explanation) 
- **Recommendations**: Based on use case and industry standards
- **Educational Content**: Explain privacy-preserving techniques

#### **Step 5: features**
- **Enable Intelligence**: Habu's AI-powered insights
- **Enable Exports**: Allow data export capabilities
- **Enable View Query**: Allow partners to view query structures
- **Enable Pair**: Enable data pairing capabilities
- **Enable OPJA**: Enable Open Path Join Analysis
- **Smart Recommendations**: Based on clean room type and use case

#### **Step 6: question_permissions** (Future Enhancement)
- Define default partner permissions
- Create permission templates
- Override capabilities explanation
- Note: Can be configured post-creation

#### **Step 7: review**
- Comprehensive configuration summary
- Cost implications (if applicable)
- Security and privacy summary
- Estimated setup time
- Final confirmation prompt

#### **Step 8: create**
- Execute clean room creation API call
- Real-time status updates
- Handle creation process
- Provide next steps and resources

## 🛠️ **Implementation Details**

### **Tool Definition:**
```typescript
{
  name: 'start_clean_room_creation_wizard',
  description: 'Interactive wizard to create a new clean room with guided step-by-step configuration',
  inputSchema: {
    type: 'object',
    properties: {
      step: {
        description: 'Current wizard step',
        enum: ['start', 'basic_info', 'infrastructure', 'privacy_controls', 'features', 'review', 'create']
      },
      // Step-specific parameters...
    }
  }
}
```

### **State Management:**
- Use parameter passing between steps (stateless MCP design)
- Validate previous step data at each new step
- Carry forward configuration through wizard
- Enable step-back functionality for corrections

### **API Integration:**
- **Endpoint**: `POST /cleanrooms`
- **Authentication**: OAuth2 via existing authenticator
- **Validation**: Real-time validation where possible
- **Error Handling**: Comprehensive error messages with guidance

### **Smart Features:**

#### **Intelligent Defaults:**
- **Type**: "Hybrid" (most common for walled gardens)
- **Cloud**: "CLOUD_AWS" (most mature platform)
- **Region**: "REGION_US" (default for US customers)
- **Start Date**: Tomorrow (allows for setup time)
- **Privacy Controls**: Industry-standard moderate settings

#### **Contextual Guidance:**
- Explain impact of each choice
- Provide use-case specific recommendations
- Link to relevant documentation
- Warning for irreversible decisions

#### **Validation Rules:**
- **Date Logic**: Start date must be future, end date after start
- **Name Uniqueness**: Check against existing clean rooms
- **Cloud/Region Compatibility**: Validate supported combinations
- **Privacy Parameter Ranges**: Ensure valid values

## 📱 **User Experience Flow**

### **Happy Path Example:**
```
1. User: "I want to create a new clean room"
2. Tool: start_clean_room_creation_wizard(step="start")
3. Response: Welcome, explanation, begin prompt
4. User: "Let's start"
5. Tool: start_clean_room_creation_wizard(step="basic_info")
6. Response: Name/description/dates prompts with validation
7. User provides basic info
8. Tool: start_clean_room_creation_wizard(step="infrastructure", name="...", ...)
9. Continue through steps...
10. Final creation and confirmation
```

### **Error Handling Examples:**
- **Invalid Date**: "Start date must be in the future. Please provide a date after today."
- **Duplicate Name**: "A clean room with this name already exists. Please choose a different name."
- **API Failure**: "Clean room creation failed. Error: [details]. Would you like to retry or modify settings?"

## 🚀 **Implementation Phases**

### **Phase 1: Core Wizard (This Implementation)**
- Steps 1-5, 7-8 (skip question_permissions initially)
- Basic validation and error handling
- Integration with existing OAuth2 system
- Comprehensive testing

### **Phase 2: Enhanced Features (Future)**
- Question permissions configuration
- Partner invitation during creation
- Data connection linking
- Advanced validation (name uniqueness checks)

### **Phase 3: Production Optimization (Future)**
- Performance optimizations
- Enhanced error recovery
- Audit logging
- Multi-tenancy considerations

## 🔧 **Technical Specifications**

### **Dependencies:**
- Existing OAuth2 authentication system
- Current API client architecture
- Date validation libraries
- Error handling patterns from AWS S3 wizard

### **Integration Points:**
- Add to existing `production-index.ts`
- Leverage `makeAPICall()` function
- Use established error handling patterns
- Follow existing tool naming conventions

### **Testing Strategy:**
- Unit tests for each wizard step
- Integration tests with mock API
- End-to-end testing with real API
- Error scenario validation

## 📊 **Success Metrics**

### **Functional Success:**
- ✅ Wizard completes successfully for valid inputs
- ✅ Proper validation and error handling
- ✅ Clean room created with correct configuration
- ✅ Clear user guidance throughout process

### **User Experience Success:**
- ✅ Intuitive step progression
- ✅ Clear instructions and recommendations
- ✅ Helpful error messages and recovery
- ✅ Confidence in final configuration

## 🎯 **Next Steps**

1. **Implement Core Tool**: Add `start_clean_room_creation_wizard` to production-index.ts
2. **Build Step Logic**: Implement each wizard step with validation
3. **Test Integration**: Verify with existing OAuth2 system
4. **Document Usage**: Update README with wizard documentation
5. **Production Testing**: Create test clean rooms to validate workflow

This plan provides a comprehensive foundation for implementing a user-friendly, production-ready clean room creation wizard that follows our established design principles and integrates seamlessly with the existing MCP server architecture.