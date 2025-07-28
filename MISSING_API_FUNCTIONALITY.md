# 🔍 Missing API Functionality: UI vs API Feature Gaps

**Project**: Habu MCP Server  
**Date Created**: January 17, 2025  
**Purpose**: Track features/data available in Habu UI but not accessible via API

## 📋 Overview

This document tracks the ongoing discovery of functionality that exists in the Habu Clean Room web interface but is not available through the API endpoints we have access to. This helps identify limitations and potential enhancement areas.

---

## 🏠 **Clean Room Information Gaps**

### Current Status: `list_cleanrooms` Tool Analysis

**✅ Successfully Retrieved from API:**
- ID, Display ID, Name, Description
- Status, Start Date, End Date  
- Owner Organization, Partners
- Questions Count (via additional API call)
- Admin User & Role (via additional API call)
- Basic parameters (Enable Export only)
- Created/Modified timestamps
- Clean Room Type (via UUID mapping)

**❌ Missing from API Response:**

#### 1. **Admin User Information**
**UI Shows**: `scott.baker@liveramp.com`  
**API Investigation**: 
- CleanRoom schema includes `timeAudit` but NOT `userAudit`  
- UserAudit schema exists with `createdBy`/`updatedBy` fields
- **✅ SOLUTION FOUND**: Additional API call to `/cleanrooms/{id}/users` retrieves admin user
- **Status**: ✅ **RESOLVED** - Admin user and role now retrieved successfully

#### 2. **Infrastructure Configuration**
**UI Shows**: `Cloud: AWS, Region: US`  
**API Investigation**:
- CleanRoomParameterRequest schema includes `CLOUD` and `REGION` fields
- Available values: `CLOUD_AWS`, `REGION_US`, etc.
- **Root Cause**: API response `cleanRoomParameters` object only contains `ENABLE_EXPORT: true`
- **Status**: ❌ **API LIMITATION** - Parameters incomplete in response

#### 3. **Complete Privacy Parameters**
**UI Shows**: `Enable Intelligence: YES, Data Decibel: 0, Crowd Size: 0`  
**API Investigation**:
- CleanRoomParameterRequest schema includes:
  - `ENABLE_HABU_INTELLIGENCE`
  - `DATA_DECIBEL` 
  - `CROWD_SIZE`
- **Root Cause**: API response only returns subset of parameters
- **Status**: ❌ **API LIMITATION** - Parameters incomplete in response

#### 4. **User Ownership Context**  
**UI Shows**: `Ownership: Owner`  
**API Investigation**:
- No ownership field in CleanRoom schema
- May be derived from user role comparison
- **Status**: 🔄 **NEEDS INVESTIGATION** - Check user roles

---

## 🔧 **Recommended API Enhancement Actions**

### **Immediate Actions (Investigation Needed)**

1. ✅ **Test Users Endpoint - COMPLETED**
   - **Endpoint**: `GET /cleanrooms/{cleanroomId}/users`
   - **Result**: Successfully retrieves admin user and role information
   - **Implementation**: Added to `list_cleanrooms` tool

2. **Investigate Parameters Issue**
   - **Endpoint**: Try different parameters or headers
   - **Goal**: Get complete cleanRoomParameters object
   - **Expected**: CLOUD, REGION, ENABLE_INTELLIGENCE, DATA_DECIBEL, CROWD_SIZE

### **API Limitations Confirmed**

1. **Incomplete Parameter Response**
   - **Issue**: cleanRoomParameters object missing most fields
   - **Impact**: Cannot show infrastructure or privacy settings
   - **Workaround**: None available

---

## 📊 **Additional Functionality Gaps** 

*To be added as testing continues through other tools*

### **Partner Management** 
- TBD during partner tool testing

### **Question Management**
- TBD during question tool testing  

### **Dataset Management**
- TBD during dataset tool testing

### **Execution & Results**
- TBD during execution tool testing

---

## 🎯 **Resolution Tracking**

### **Investigation Queue**
1. ✅ **COMPLETED**: Test `/cleanrooms/{id}/users` endpoint for admin information
2. 🔄 **NEXT**: Investigate complete parameters retrieval (cloud/region/intelligence/decibel/crowd)
3. ⏳ **PENDING**: Continue gap discovery during tool testing

### **Resolution Methods**
- **✅ RESOLVED**: Additional API calls (questions count)
- **✅ RESOLVED**: Data mapping (cleanroom type UUID → "Hybrid")
- **🔄 INVESTIGATING**: Missing API data
- **❌ CONFIRMED LIMITED**: API response incomplete

---

## 📝 **Notes for Development**

1. **API Response Completeness**: The LiveRamp API appears to return partial data compared to UI
2. **Multiple Calls Required**: Complete information requires multiple API endpoints
3. **Schema vs Reality**: API specification shows fields not returned in practice
4. **Mapping Required**: Some fields need translation (UUIDs → readable names)

---

*This document will be updated throughout the comprehensive tool testing process*

**Last Updated**: January 17, 2025  
**Next Review**: After `list_cleanrooms` investigation complete