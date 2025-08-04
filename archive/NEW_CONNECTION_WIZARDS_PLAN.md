# 🚀 New Connection Wizards Development Plan

## 🎯 **Project Overview**
Create comprehensive MCP Server connection wizards for high-value data sources, following the successful AWS S3 wizard pattern.

**Priority Focus**: Build missing connection wizards for Google Ads Data Hub (ADH), Amazon Marketing Cloud (AMC), and enhanced Snowflake variants.

---

## 📋 **Development Plan: Priority Tools**

### **Phase 1: High-Impact Marketing Platforms (Week 1)**

#### **🔴 Tool 1: Google Ads Data Hub (ADH) Connection Wizard**
**Tool Name**: `create_google_ads_data_hub_wizard`
**Business Impact**: 🔴 **High** - Major advertising analytics platform
**Implementation Complexity**: 🟡 **Medium** - OAuth + API configuration

**Technical Requirements**:
- Google Ads API credentials (OAuth2 or Service Account)
- ADH project configuration
- Customer ID and account structure
- Query permissions and access controls

**Wizard Steps**:
1. `start` - Introduction and requirements
2. `connection_info` - Name, category, description
3. `google_auth` - OAuth2 or Service Account authentication
4. `adh_config` - ADH project, customer ID, access level
5. `permissions` - Query permissions and data access
6. `validation` - Test connection and permissions
7. `creation` - Create and configure connection

---

#### **🔴 Tool 2: Amazon Marketing Cloud (AMC) Connection Wizard**
**Tool Name**: `create_amazon_marketing_cloud_wizard`
**Business Impact**: 🔴 **High** - Amazon advertising platform
**Implementation Complexity**: 🟡 **Medium** - AWS credentials + AMC configuration

**Technical Requirements**:
- Amazon Advertising API credentials
- AMC instance configuration
- AWS access for data export
- Query and data access permissions

**Wizard Steps**:
1. `start` - Introduction and AMC overview
2. `connection_info` - Name, category, description
3. `amazon_auth` - Amazon Advertising API credentials
4. `amc_config` - AMC instance, advertiser ID, region
5. `aws_integration` - AWS credentials for data export
6. `validation` - Test AMC connection and permissions
7. `creation` - Create and configure connection

---

### **Phase 2: Enhanced Snowflake Variants (Week 2)**

#### **🟡 Tool 3: Snowflake Data Share Connection Wizard**
**Tool Name**: `create_snowflake_data_share_wizard`
**Business Impact**: 🟠 **Medium** - Enterprise data sharing
**Implementation Complexity**: 🟡 **Medium** - Snowflake data sharing + permissions

**Technical Requirements**:
- Snowflake account with data sharing enabled
- Data share provider/consumer configuration
- Cross-account permissions
- Share object access controls

**Wizard Steps**:
1. `start` - Data sharing overview
2. `connection_info` - Name, category, description
3. `snowflake_auth` - Account, credentials, role
4. `data_share_config` - Share name, provider, objects
5. `permissions` - Access controls and limitations
6. `validation` - Test share access and permissions
7. `creation` - Create and configure connection

---

#### **🟡 Tool 4: Snowflake Secure Views Connection Wizard**
**Tool Name**: `create_snowflake_secure_views_wizard`
**Business Impact**: 🟠 **Medium** - Privacy-preserving analytics
**Implementation Complexity**: 🟡 **Medium** - Secure views + access controls

**Technical Requirements**:
- Snowflake secure view configuration
- Row-level security policies
- Column masking and encryption
- Access control integration

**Wizard Steps**:
1. `start` - Secure views introduction
2. `connection_info` - Name, category, description
3. `snowflake_auth` - Account, credentials, role
4. `secure_view_config` - View selection, security policies
5. `privacy_controls` - Masking, encryption, access rules
6. `validation` - Test secure access and data visibility
7. `creation` - Create and configure connection

---

### **Phase 3: CRM & Business Platforms (Week 3)**

#### **🔴 Tool 5: HubSpot Connection Wizard**
**Tool Name**: `create_hubspot_connection_wizard`
**Business Impact**: 🔴 **High** - Major CRM platform
**Implementation Complexity**: 🟢 **Low** - Standard OAuth API

**Technical Requirements**:
- HubSpot OAuth2 or API key
- Portal/hub selection
- Object permissions (contacts, companies, deals)
- Data sync configuration

**Wizard Steps**:
1. `start` - HubSpot integration overview
2. `connection_info` - Name, category, description
3. `hubspot_auth` - OAuth2 or API key authentication
4. `portal_config` - Portal selection, object access
5. `data_config` - Property mapping, sync settings
6. `validation` - Test API access and data retrieval
7. `creation` - Create and configure connection

---

#### **🔴 Tool 6: Salesforce Connection Wizard**
**Tool Name**: `create_salesforce_connection_wizard`
**Business Impact**: 🔴 **High** - Enterprise CRM leader
**Implementation Complexity**: 🟡 **Medium** - Salesforce OAuth + org config

**Technical Requirements**:
- Salesforce OAuth2 credentials
- Org configuration and permissions
- SOQL query access
- Data export capabilities

**Wizard Steps**:
1. `start` - Salesforce integration overview
2. `connection_info` - Name, category, description
3. `salesforce_auth` - OAuth2 authentication setup
4. `org_config` - Organization, permissions, objects
5. `query_config` - SOQL access, data selection
6. `validation` - Test org access and data queries
7. `creation` - Create and configure connection

---

## 🛠️ **Implementation Strategy**

### **Step 1: Project Setup**
- [ ] Create feature branch `feature/new-connection-wizards`
- [ ] Set up development environment
- [ ] Review existing wizard patterns
- [ ] Create reusable wizard components

### **Step 2: Tool Template Creation**
- [ ] Create wizard base template
- [ ] Standard parameter validation
- [ ] Common authentication patterns
- [ ] Error handling framework

### **Step 3: Incremental Development**
- [ ] Build one tool at a time
- [ ] Test each wizard step thoroughly
- [ ] Document integration requirements
- [ ] Commit after each successful tool

### **Step 4: Integration Testing**
- [ ] Test with real API credentials
- [ ] Validate end-to-end workflows
- [ ] Document any API limitations
- [ ] Update tool testing status

---

## 🔍 **Development Milestones**

### **Milestone 1: Foundation (Day 1-2)**
- [ ] Project setup and branch creation
- [ ] Wizard template and common components
- [ ] Authentication pattern analysis
- [ ] Initial commit with foundation

### **Milestone 2: Google Ads Data Hub (Day 3-4)**
- [ ] Tool design and specification
- [ ] Wizard implementation
- [ ] API integration testing
- [ ] Documentation and testing

### **Milestone 3: Amazon Marketing Cloud (Day 5-6)**
- [ ] Tool design and specification
- [ ] Wizard implementation
- [ ] AWS + AMC integration testing
- [ ] Documentation and testing

### **Milestone 4: Snowflake Enhanced (Day 7-8)**
- [ ] Data share wizard implementation
- [ ] Secure views wizard implementation
- [ ] Integration testing
- [ ] Documentation updates

### **Milestone 5: CRM Platforms (Day 9-10)**
- [ ] HubSpot wizard implementation
- [ ] Salesforce wizard implementation
- [ ] OAuth integration testing
- [ ] Final documentation

---

## 📊 **Technical Architecture**

### **Wizard Pattern Template**
```typescript
{
  name: 'create_[platform]_connection_wizard',
  description: 'Interactive wizard for creating [Platform] data connections...',
  inputSchema: {
    type: 'object',
    properties: {
      step: {
        type: 'string',
        enum: ['start', 'connection_info', 'authentication', 'config', 'validation', 'creation']
      },
      // Platform-specific parameters
    }
  }
}
```

### **Common Components**
- **Authentication handlers** - OAuth2, API keys, service accounts
- **Parameter validators** - Input validation and error handling
- **Connection testers** - API connectivity verification
- **Progress tracking** - Multi-step wizard state management

### **API Integration Points**
- **Credential creation** - `/organization-credentials` endpoint
- **Connection creation** - Platform-specific data connection endpoints
- **Validation testing** - API connectivity and permission verification

---

## 🎯 **Success Criteria**

### **Functional Requirements**
- [ ] All 6 wizards implement complete end-to-end workflows
- [ ] Real API integration with authentication testing
- [ ] Error handling and user guidance
- [ ] Integration with existing MCP infrastructure

### **Quality Requirements**
- [ ] Follow existing wizard patterns and consistency
- [ ] Comprehensive error handling and validation
- [ ] Clear documentation and usage examples
- [ ] Production-ready with real credential testing

### **User Experience Requirements**
- [ ] Intuitive step-by-step guidance
- [ ] Clear progress indication and next steps
- [ ] Helpful error messages and troubleshooting
- [ ] Integration with credential management

---

## 📈 **Expected Impact**

### **Coverage Improvement**
- **Before**: 8/28 data sources (28.6% coverage)
- **After**: 14/28 data sources (50% coverage)
- **High-Impact Platforms**: 6 major platforms added

### **Business Value**
- **Marketing Analytics**: Google Ads Data Hub, Amazon Marketing Cloud
- **Enterprise CRM**: HubSpot, Salesforce integration
- **Advanced Data Sharing**: Enhanced Snowflake capabilities
- **End-to-End Workflows**: Complete connection automation

### **Technical Benefits**
- **Reusable Components**: Wizard template for future tools
- **API Coverage**: Enhanced understanding of Habu API capabilities
- **Integration Patterns**: Proven authentication and connection patterns
- **Quality Improvement**: Systematic testing and documentation

---

## 🔄 **Next Steps After Completion**

1. **Tool Testing** - Systematic validation of all new wizards
2. **Documentation Updates** - Update coverage analysis and user guides
3. **Community Feedback** - Gather user feedback on wizard experience
4. **Future Enhancements** - Plan additional data source wizards

---

**Target Completion**: 10 days
**Total New Tools**: 6 connection wizards
**Coverage Impact**: +21.4% data source coverage
**Business Value**: High-impact marketing and CRM platform integration