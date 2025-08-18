#!/usr/bin/env python3
"""
🚀 Habu MCP Server Showcase
Interactive Streamlit app to explore the comprehensive MCP Server for Habu Clean Room API
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from pathlib import Path
import re
from datetime import datetime
import json
import hashlib

# Page config
st.set_page_config(
    page_title="Habu MCP Server Project Overview",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Force sidebar to stay open and improve styling
st.markdown("""
<style>
    /* Keep sidebar always visible and properly sized */
    .sidebar .sidebar-content {
        width: 300px;
    }
    section[data-testid="stSidebar"] {
        width: 300px !important;
        min-width: 300px !important;
    }
    section[data-testid="stSidebar"] > div {
        width: 300px !important;
        min-width: 300px !important;
    }
    
    /* Prevent sidebar from collapsing */
    section[data-testid="stSidebar"][aria-expanded="false"] {
        width: 300px !important;
        margin-left: 0px !important;
    }
    
    /* Style the navigation menu items */
    .nav-item {
        padding: 10px 15px;
        margin: 5px 0;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid transparent;
    }
    
    .nav-item:hover {
        background-color: rgba(151, 166, 195, 0.15);
        border-color: rgba(151, 166, 195, 0.3);
    }
    
    .nav-item.selected {
        background-color: rgba(255, 75, 75, 0.1);
        border-color: rgba(255, 75, 75, 0.3);
        font-weight: bold;
    }
    
    /* Hide the default radio button styling */
    .stRadio > div {
        flex-direction: column;
        gap: 8px;
    }
    
    .stRadio > div > label {
        background-color: transparent;
        border: 1px solid rgba(151, 166, 195, 0.2);
        border-radius: 8px;
        padding: 12px 15px;
        margin: 4px 0;
        cursor: pointer;
        transition: all 0.3s ease;
        display: block;
        width: 100%;
    }
    
    .stRadio > div > label:hover {
        background-color: rgba(151, 166, 195, 0.15);
        border-color: rgba(151, 166, 195, 0.4);
        transform: translateX(2px);
    }
    
    .stRadio > div > label[data-checked="true"] {
        background-color: rgba(255, 75, 75, 0.1);
        border-color: rgba(255, 75, 75, 0.4);
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(255, 75, 75, 0.2);
    }
</style>
""", unsafe_allow_html=True)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        font-weight: bold;
        margin-bottom: 1rem;
    }
    
    .success-metric {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin: 0.5rem 0;
    }
    
    .tool-card {
        border: 2px solid #e9ecef;
        border-radius: 15px;
        padding: 1.2rem;
        margin: 0.8rem 0;
        background: linear-gradient(145deg, #ffffff, #f8f9fa);
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .tool-card:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #007bff, #6f42c1, #e83e8c);
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .tool-card:hover {
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        border-color: #007bff;
        transform: translateY(-2px);
    }
    
    .tool-card:hover:before {
        opacity: 1;
    }
    
    .tool-card h4 {
        margin-bottom: 0.6rem;
        font-size: 1.05rem;
        font-weight: 600;
    }
    
    .tool-card p {
        margin-bottom: 0.4rem;
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    .status-verified { color: #28a745; font-weight: bold; }
    .status-partial { color: #ffc107; font-weight: bold; }
    .status-untested { color: #6c757d; font-weight: bold; }
    .status-issue { color: #dc3545; font-weight: bold; }
    
    .learning-card {
        background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
        padding: 1rem;
        border-radius: 10px;
        margin: 0.5rem 0;
    }
    
    .limitation-card {
        background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
        padding: 1rem;
        border-radius: 10px;
        margin: 0.5rem 0;
        color: white;
    }
    
    .info-badge {
        display: inline-block;
        background: #17a2b8;
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        margin: 2px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .feature-highlight {
        background: linear-gradient(90deg, #f8f9fa, #e9ecef);
        border-left: 4px solid #007bff;
        padding: 8px 12px;
        border-radius: 0 6px 6px 0;
        margin: 8px 0;
        font-size: 0.9rem;
    }
    
    .api-endpoint {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        padding: 6px 10px;
        font-family: 'Courier New', monospace;
        font-size: 0.85rem;
        margin: 4px 0;
        color: #495057;
    }
    
    .quick-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .stat-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .enhanced-expander {
        border: 1px solid #dee2e6;
        border-radius: 8px;
        margin: 8px 0;
        overflow: hidden;
    }
    
    .enhanced-expander summary {
        background: linear-gradient(90deg, #f8f9fa, #e9ecef);
        padding: 12px 16px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s ease;
    }
    
    .enhanced-expander summary:hover {
        background: linear-gradient(90deg, #e9ecef, #dee2e6);
    }
</style>
""", unsafe_allow_html=True)

def load_markdown_file(filename):
    """Load and return contents of a markdown file"""
    try:
        file_path = Path(filename)
        if file_path.exists():
            return file_path.read_text()
        return f"File {filename} not found"
    except Exception as e:
        return f"Error loading {filename}: {str(e)}"

def clean_text_content(text):
    """Clean text content to prevent HTML injection and rendering issues"""
    if not text:
        return ""
    import html
    # Escape any HTML characters that might cause rendering issues
    cleaned = html.escape(str(text))
    # Additional cleaning for common problematic patterns
    cleaned = cleaned.replace("</div>", "").replace("<div", "").replace("&lt;/div&gt;", "")
    return cleaned

@st.cache_data(ttl=300)  # Cache for 5 minutes
def parse_tool_testing_status():
    """Parse the MCP_TOOL_TESTING_STATUS.md file to extract tool status"""
    content = load_markdown_file("MCP_TOOL_TESTING_STATUS.md")
    
    # Extract tool status table
    tools = []
    lines = content.split('\n')
    in_table = False
    
    for line in lines:
        if '| Tool | Status | Issues | Priority |' in line:
            in_table = True
            continue
        elif in_table and line.startswith('|') and 'Tool' not in line and '---' not in line:
            parts = [p.strip() for p in line.split('|')[1:-1]]  # Remove empty first/last
            if len(parts) >= 3:
                tool_name = parts[0]
                status = parts[1]
                issues = parts[2]
                priority = parts[3] if len(parts) > 3 else "-"
                
                # Determine status category
                if '✅' in status:
                    status_cat = 'verified'
                elif '🟡' in status:
                    status_cat = 'partial'
                elif '❌' in status:
                    status_cat = 'issue'
                else:
                    status_cat = 'untested'
                
                tools.append({
                    'name': tool_name,
                    'status': status,
                    'status_category': status_cat,
                    'issues': issues,
                    'priority': priority
                })
        elif in_table and not line.startswith('|'):
            break
    
    # Also parse detailed tool reports for more comprehensive status
    detailed_tools = parse_detailed_tool_reports(content)
    
    # Merge with table data
    for detailed_tool in detailed_tools:
        # Check if tool already in table data
        found = False
        for i, tool in enumerate(tools):
            if tool['name'] == detailed_tool['name']:
                tools[i].update(detailed_tool)
                found = True
                break
        if not found:
            tools.append(detailed_tool)
    
    return tools

def parse_detailed_tool_reports(content):
    """Parse detailed tool reports from MCP_TOOL_TESTING_STATUS.md"""
    tools = []
    lines = content.split('\n')
    
    current_tool = None
    in_tool_section = False
    
    for line in lines:
        # Look for tool headers like "### 🔧 **create_bigquery_connection_wizard**"
        if line.startswith('### ') and '**' in line:
            # Extract tool name
            match = re.search(r'\*\*([^*]+)\*\*', line)
            if match:
                tool_name = match.group(1)
                current_tool = {
                    'name': tool_name,
                    'detailed_status': '',
                    'working_components': [],
                    'current_issues': [],
                    'technical_details': '',
                    'next_steps': []
                }
                in_tool_section = True
        
        elif in_tool_section and current_tool:
            # Parse status line
            if line.startswith('**Status**:'):
                status_text = line.replace('**Status**:', '').strip()
                current_tool['detailed_status'] = status_text
                
                # Determine category from detailed status
                if '✅' in status_text or 'Verified' in status_text:
                    current_tool['status_category'] = 'verified'
                elif '🟡' in status_text or 'Complete' in status_text:
                    current_tool['status_category'] = 'partial'
                elif '❌' in status_text or 'CRITICAL' in status_text:
                    current_tool['status_category'] = 'issue'
                else:
                    current_tool['status_category'] = 'untested'
            
            # Parse working components
            elif '#### ✅ **Working Components:**' in line:
                section = 'working'
            elif '#### ❌ **Current Issues:**' in line:
                section = 'issues'
            elif '#### 🔍 **Technical Details:**' in line:
                section = 'technical'
            elif '#### 🎯 **Next Steps:**' in line:
                section = 'next_steps'
            elif line.startswith('### ') and current_tool:
                # End of current tool section
                tools.append(current_tool)
                in_tool_section = False
                current_tool = None
    
    # Add last tool if we were processing one
    if current_tool:
        tools.append(current_tool)
    
    return tools

@st.cache_data(ttl=300)  # Cache for 5 minutes
def parse_testing_progress():
    """Parse TESTING_PROGRESS.md for completed tests"""
    content = load_markdown_file("TESTING_PROGRESS.md")
    
    # Extract completed tests
    completed_tools = []
    lines = content.split('\n')
    
    for line in lines:
        if '**`' in line and ('✅' in line or 'VALIDATED' in line):
            # Extract tool name from **`tool_name`**
            match = re.search(r'\*\*`([^`]+)`\*\*', line)
            if match:
                tool_name = match.group(1)
                status = "✅ Verified" if '✅' in line else "✅ Validated"
                completed_tools.append({
                    'name': tool_name,
                    'status': status,
                    'details': line.strip()
                })
    
    return completed_tools

def get_file_update_info():
    """Get information about file updates and sizes"""
    import os
    from pathlib import Path
    
    # Get file modification times and sizes
    files_to_check = [
        "MCP_TOOL_TESTING_STATUS.md",
        "TESTING_PROGRESS.md", 
        "README.md",
        "MISSION_ACCOMPLISHED.md"
    ]
    
    latest_time = None
    file_info = {}
    
    for filename in files_to_check:
        path = Path(filename)
        if path.exists():
            stat = path.stat()
            mod_time = datetime.fromtimestamp(stat.st_mtime)
            file_info[filename] = {
                'size': stat.st_size,
                'lines': len(path.read_text().split('\n')),
                'modified': mod_time
            }
            if latest_time is None or mod_time > latest_time:
                latest_time = mod_time
    
    # Count total markdown files
    total_docs = len(list(Path('.').glob('*.md')))
    
    return {
        'last_updated': latest_time.strftime("%Y-%m-%d %H:%M") if latest_time else "Unknown",
        'testing_status_size': file_info.get('MCP_TOOL_TESTING_STATUS.md', {}).get('lines', 0),
        'progress_size': file_info.get('TESTING_PROGRESS.md', {}).get('lines', 0),
        'total_docs': total_docs,
        'file_info': file_info
    }

@st.cache_data
def get_tool_categories():
    """Define tool categories and their tools"""
    return {
        "Foundation Tools (9)": [
            "test_connection", "list_cleanrooms", "list_questions", 
            "configure_data_connection_fields", "complete_data_connection_setup",
            "create_aws_s3_connection", "start_aws_s3_connection_wizard", 
            "create_bigquery_connection_wizard", "start_clean_room_creation_wizard"
        ],
        "Partner Collaboration (4)": [
            "invite_partner_to_cleanroom", "manage_partner_invitations",
            "configure_partner_permissions", "partner_onboarding_wizard"
        ],
        "Question Management (4)": [
            "deploy_question_to_cleanroom", "question_management_wizard",
            "manage_question_permissions", "question_scheduling_wizard"
        ],
        "Dataset Management (4)": [
            "provision_dataset_to_cleanroom", "dataset_configuration_wizard",
            "manage_dataset_permissions", "dataset_transformation_wizard"
        ],
        "Execution & Results (4)": [
            "execute_question_run", "check_question_run_status",
            "results_access_and_export", "scheduled_run_management"
        ],
        "Clean Room Lifecycle (4)": [
            "update_cleanroom_configuration", "cleanroom_health_monitoring",
            "cleanroom_lifecycle_manager", "cleanroom_access_audit"
        ],
        "Multi-Cloud Data (5)": [
            "create_snowflake_connection_wizard", "create_databricks_connection_wizard",
            "create_gcs_connection_wizard", "create_azure_connection_wizard",
            "data_connection_health_monitor"
        ],
        "Enterprise Tools (3)": [
            "data_export_workflow_manager", "execution_template_manager",
            "advanced_user_management"
        ]
    }

def main():
    # Header
    st.markdown('<h1 class="main-header">Habu MCP Server Project Overview</h1>', unsafe_allow_html=True)
    st.markdown('<p style="text-align: center; font-size: 1.3rem; color: #666;">Model Context Protocol Server for LiveRamp Clean Room API</p>', unsafe_allow_html=True)
    
    # Sidebar navigation with always-visible menu
    st.sidebar.title("🧭 Navigation")
    st.sidebar.markdown("---")
    
    # Use radio buttons for always-visible navigation
    page = st.sidebar.radio(
        "Choose a section:",
        [
            "🏠 Project Overview", 
            "🛠️ MCP Tools Explorer", 
            "📊 Testing Dashboard",
            "🧠 Key Learnings", 
            "⚠️ Known Limitations", 
            "🎯 Work To Do",
            "📚 Documentation Hub"
        ],
        index=0,
        label_visibility="collapsed"
    )
    
    # Route to functions without flex_mode
    if page == "🏠 Project Overview":
        show_project_overview()
    elif page == "🛠️ MCP Tools Explorer":
        show_tools_explorer()
    elif page == "📊 Testing Dashboard":
        show_testing_dashboard()
    elif page == "🧠 Key Learnings":
        show_key_learnings()
    elif page == "⚠️ Known Limitations":
        show_limitations()
    elif page == "🎯 Work To Do":
        show_work_to_do()
    elif page == "📚 Documentation Hub":
        show_documentation_hub()
    


def show_project_overview():
    st.header("🏠 Project Overview")
    
    # File update status
    st.subheader("📊 Live Project Status")
    update_info = get_file_update_info()
    col1, col2 = st.columns(2)
    with col1:
        st.markdown(f"**Last Updated:** {update_info['last_updated']}")
        st.markdown(f"**Testing File:** {update_info['testing_status_size']} lines")
    with col2:
        st.markdown(f"**Progress File:** {update_info['progress_size']} lines")  
        st.markdown(f"**Total Docs:** {update_info['total_docs']} files")
    
    # Success metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown("""
        <div class="success-metric">
            <h3>99%</h3>
            <p>API Coverage</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="success-metric">
            <h3>45</h3>
            <p>Workflow Tools</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        # Calculate actual tested tools dynamically
        tool_status = parse_tool_testing_status()
        completed_tools = parse_testing_progress()
        verified_count = len([t for t in tool_status if t.get('status_category') == 'verified'])
        verified_count += len([t for t in completed_tools if t['name'] not in [ts['name'] for ts in tool_status]])
        
        st.markdown(f"""
        <div class="success-metric">
            <h3>{verified_count}/45</h3>
            <p>Tools Tested</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown("""
        <div class="success-metric">
            <h3>✅</h3>
            <p>OAuth2 Ready</p>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # What is this project
    st.subheader("🎯 What We've Built")
    st.markdown("""
    **The Habu MCP Server** transforms LiveRamp's Clean Room API from raw technical endpoints into intelligent, 
    AI-accessible workflow tools. This is a **Model Context Protocol (MCP) Server** that enables AI agents 
    (Claude, Memex, etc.) to manage enterprise data collaboration workflows.
    
    ### 🏗️ Core Architecture
    - **Primary Server**: `mcp-habu-runner/src/index.ts` (45 comprehensive tools)
    - **Authentication**: OAuth2 client credentials flow with production API
    - **Distribution**: Compiled Node.js package ready for any MCP client
    - **Coverage**: 99% of LiveRamp Clean Room API functionality
    """)
    
    # Major achievements
    st.subheader("🏆 Key Achievements")
    achievements = [
        "✅ **OAuth2 Authentication** - Working with production API after extensive testing",
        "✅ **Universal Name Resolution** - Users can use cleanroom names instead of cryptic UUIDs",
        "✅ **Smart Parameter Detection** - Intelligent SQL analysis prevents zero-result queries", 
        "✅ **End-to-End Validation** - Partner invitation workflow fully tested",
        "✅ **Enterprise Features** - Bulk operations, templates, advanced exports",
        "✅ **99% API Coverage** - Comprehensive clean room automation platform"
    ]
    
    for achievement in achievements:
        st.markdown(achievement)
    
    # Current status reality check
    st.subheader("📊 Current Status: Built but Minimally Tested")
    st.info("""
    **Reality Check**: While we have 45 sophisticated workflow tools built with 99% API coverage, 
    only **8 tools** have been validated with real users (18% tested). This represents a solid 
    foundation with enormous potential, but systematic testing is needed to unlock full value.
    """)

def show_tools_explorer():
    st.header("🛠️ MCP Tools Explorer")
    st.markdown("Explore all 45 workflow tools organized by category")
    
    # Auto-refresh toggle
    col1, col2 = st.columns([3, 1])
    with col1:
        st.markdown("**Live updates from testing files**")
    with col2:
        auto_refresh = st.checkbox("Auto-refresh", value=True)
    
    if auto_refresh:
        st.markdown("🔄 _Data refreshes automatically as testing files are updated_")
    
    # Get tool categories and testing status
    categories = get_tool_categories()
    tool_status = parse_tool_testing_status()
    completed_tools = parse_testing_progress()
    
    # Create status lookup
    status_lookup = {}
    for tool in tool_status:
        status_lookup[tool['name']] = tool
    for tool in completed_tools:
        if tool['name'] not in status_lookup:
            status_lookup[tool['name']] = {
                'name': tool['name'],
                'status': tool['status'],
                'status_category': 'verified',
                'issues': 'None',
                'priority': '-'
            }
    
    # Enhanced Filter and search options
    st.subheader("🔍 Advanced Search & Filtering")
    
    # Search and quick filters row
    col1, col2, col3, col4 = st.columns([2, 1, 1, 1])
    
    with col1:
        search_term = st.text_input("🔍 Search tools, descriptions, features:", 
                                  placeholder="e.g. connection, partner, OAuth2, AWS, wizard")
    with col2:
        status_filter = st.selectbox("📊 Status:", 
            ["All", "✅ Verified", "🟡 Partial", "❌ Issues", "⚪ Untested"])
    with col3:
        category_filter = st.selectbox("📁 Category:", 
            ["All"] + list(categories.keys()))
    with col4:
        feature_filter = st.selectbox("⚡ Feature:", 
            ["All", "Wizards", "Authentication", "Cloud", "Monitoring", "Export"])
    
    # Advanced filters (collapsible)
    with st.expander("🔧 Advanced Filters", expanded=False):
        col1, col2, col3 = st.columns(3)
        
        with col1:
            api_filter = st.multiselect("🔌 API Features:", 
                ["OAuth2", "Real-time", "Bulk Operations", "Webhooks", "Scheduled"])
        with col2:
            complexity_filter = st.selectbox("📊 Complexity Level:", 
                ["All", "Basic", "Intermediate", "Advanced", "Expert"])
        with col3:
            provider_filter = st.multiselect("☁️ Cloud Providers:", 
                ["AWS", "Google Cloud", "Azure", "Snowflake", "Databricks"])
    
    # Quick action buttons
    st.markdown("**Quick Filters:**")
    col1, col2, col3, col4, col5 = st.columns(5)
    
    quick_filters = {
        "🧙‍♂️ Wizards": "wizard",
        "🔐 Auth": "authentication", 
        "☁️ Cloud": "cloud",
        "📊 Analytics": "question",
        "👥 Partners": "partner"
    }
    
    active_quick_filter = None
    for i, (label, keyword) in enumerate(quick_filters.items()):
        col = [col1, col2, col3, col4, col5][i]
        with col:
            if st.button(label, key=f"quick_{keyword}"):
                active_quick_filter = keyword
    
    # Apply quick filter to search term
    if active_quick_filter:
        search_term = active_quick_filter
    
    # Apply filters
    filtered_categories = categories.copy()
    if category_filter != "All":
        filtered_categories = {category_filter: categories[category_filter]}
    
    # Helper function for advanced filtering
    def passes_advanced_filters(tool_name, tool_info):
        # Feature filter
        if feature_filter != "All":
            feature_keywords = {
                "Wizards": ["wizard", "interactive", "step-by-step"],
                "Authentication": ["auth", "oauth", "credentials", "token"],
                "Cloud": ["aws", "azure", "gcp", "snowflake", "databricks", "cloud"],
                "Monitoring": ["monitor", "health", "status", "track", "audit"],
                "Export": ["export", "results", "download", "delivery"]
            }
            keywords = feature_keywords.get(feature_filter, [])
            if not any(keyword.lower() in tool_name.lower() or 
                      keyword.lower() in tool_info.get('description', '').lower() or
                      any(keyword.lower() in feature.lower() for feature in tool_info.get('key_features', []))
                      for keyword in keywords):
                return False
        
        # API filter
        if api_filter:
            tool_text = f"{tool_name} {tool_info.get('description', '')} {' '.join(tool_info.get('key_features', []))}"
            if not any(api_feature.lower() in tool_text.lower() for api_feature in api_filter):
                return False
        
        # Provider filter
        if provider_filter:
            tool_text = f"{tool_name} {tool_info.get('description', '')} {' '.join(tool_info.get('key_features', []))}"
            if not any(provider.lower() in tool_text.lower() for provider in provider_filter):
                return False
        
        return True
    
    # Calculate and display filter results summary
    total_tools = sum(len(tools) for tools in categories.values())
    
    # Count filtered tools
    filtered_count = 0
    for category, tools in filtered_categories.items():
        for tool in tools:
            status_info = status_lookup.get(tool, {
                'status': 'Not Tested',
                'status_category': 'untested',
                'issues': 'No testing data',
                'priority': '-'
            })
            tool_info = get_comprehensive_tool_info().get(tool, get_default_tool_info(tool))
            
            # Apply all filters (same logic as above)
            if status_filter != "All":
                status_map = {
                    "✅ Verified": "verified", "🟡 Partial": "partial", 
                    "❌ Issues": "issue", "⚪ Untested": "untested"
                }
                if status_info.get('status_category') != status_map.get(status_filter):
                    continue
            
            if search_term:
                search_text = f"{tool} {tool_info.get('description', '')} {' '.join(tool_info.get('key_features', []))}"
                if search_term.lower() not in search_text.lower():
                    continue
            
            if not passes_advanced_filters(tool, tool_info):
                continue
                
            filtered_count += 1
    
    # Display filter summary
    if filtered_count != total_tools:
        st.info(f"📊 Showing **{filtered_count}** out of **{total_tools}** total tools based on your filters.")
    else:
        st.info(f"📊 Showing all **{total_tools}** tools in the MCP Server.")
    
    st.markdown("---")
    
    # Quick Statistics Dashboard
    col1, col2, col3, col4 = st.columns(4)
    
    # Calculate comprehensive tool stats
    comprehensive_tools = list(get_comprehensive_tool_info().keys())
    wizard_tools = [tool for cat_tools in categories.values() for tool in cat_tools if 'wizard' in tool.lower()]
    verified_tools = [tool for tool in status_lookup.keys() if status_lookup[tool].get('status_category') == 'verified']
    cloud_tools = [tool for cat_tools in categories.values() for tool in cat_tools 
                   if any(provider in tool.lower() for provider in ['aws', 'azure', 'gcp', 'snowflake', 'databricks'])]
    
    with col1:
        st.markdown(f"""
        <div class="stat-card">
            <h3>{len(comprehensive_tools)}</h3>
            <p>⭐ Detailed Tools</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class="stat-card">
            <h3>{len(wizard_tools)}</h3>
            <p>🧙‍♂️ Interactive Wizards</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class="stat-card">
            <h3>{len(verified_tools)}</h3>
            <p>✅ Verified Tools</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown(f"""
        <div class="stat-card">
            <h3>{len(cloud_tools)}</h3>
            <p>☁️ Cloud Connections</p>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Display tools by category
    for category, tools in filtered_categories.items():
        # Filter tools based on all criteria
        filtered_tools = []
        for tool in tools:
            status_info = status_lookup.get(tool, {
                'status': 'Not Tested',
                'status_category': 'untested',
                'issues': 'No testing data',
                'priority': '-'
            })
            
            # Get comprehensive tool info for filtering
            tool_info = get_comprehensive_tool_info().get(tool, get_default_tool_info(tool))
            
            # Apply status filter
            if status_filter != "All":
                status_map = {
                    "✅ Verified": "verified",
                    "🟡 Partial": "partial", 
                    "❌ Issues": "issue",
                    "⚪ Untested": "untested"
                }
                if status_info.get('status_category') != status_map.get(status_filter):
                    continue
            
            # Apply search filter (search in name, description, and features)
            if search_term:
                search_text = f"{tool} {tool_info.get('description', '')} {' '.join(tool_info.get('key_features', []))}"
                if search_term.lower() not in search_text.lower():
                    continue
            
            # Apply advanced filters
            if not passes_advanced_filters(tool, tool_info):
                continue
                
            filtered_tools.append((tool, status_info, tool_info))
        
        if filtered_tools:  # Only show category if it has matching tools
            with st.expander(f"📁 {category} ({len(filtered_tools)} tools)", expanded=True):
                for tool, status_info, tool_info in filtered_tools:
                    # Status icon and color
                    status_cat = status_info.get('status_category', 'untested')
                    if status_cat == 'verified':
                        icon = "✅"
                        css_class = "status-verified"
                    elif status_cat == 'partial':
                        icon = "🟡"
                        css_class = "status-partial"
                    elif status_cat == 'issue':
                        icon = "❌"
                        css_class = "status-issue"
                    else:
                        icon = "⚪"
                        css_class = "status-untested"
                    
                    # Create enhanced tool card layout with comprehensive information
                    with st.container():
                        # Main tool info with description - ensure no HTML content
                        raw_description = tool_info.get('description', f'Advanced workflow tool for {tool.replace("_", " ").title()}')
                        # Clean any potential HTML content from descriptions
                        description_preview = clean_text_content(raw_description)
                        if len(description_preview) > 150:
                            description_preview = description_preview[:150] + "..."
                        
                        # Format key features properly (show first 3 features)
                        key_features_text = ""
                        if tool_info.get('key_features'):
                            features = tool_info['key_features'][:3]
                            # Clean each feature to prevent HTML issues
                            cleaned_features = [clean_text_content(feature) for feature in features]
                            key_features_text = ' • '.join(cleaned_features)
                        
                        # Determine tool type badges
                        tool_badges = []
                        tool_name_lower = tool.lower()
                        if 'wizard' in tool_name_lower:
                            tool_badges.append('<span style="background: #17a2b8; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.7rem;">🧙‍♂️ WIZARD</span>')
                        if any(provider in tool_name_lower for provider in ['aws', 'azure', 'gcp', 'snowflake', 'databricks']):
                            tool_badges.append('<span style="background: #28a745; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.7rem;">☁️ CLOUD</span>')
                        if 'connection' in tool_name_lower:
                            tool_badges.append('<span style="background: #fd7e14; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.7rem;">🔗 CONNECTION</span>')
                        if any(word in tool_name_lower for word in ['monitor', 'health', 'audit']):
                            tool_badges.append('<span style="background: #6f42c1; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.7rem;">📊 MONITORING</span>')
                        
                        badges_html = ' '.join(tool_badges) if tool_badges else ''
                        
                        # Check if this tool has comprehensive information
                        has_comprehensive_info = tool in get_comprehensive_tool_info()
                        comprehensive_badge = '<span style="background: #dc3545; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.7rem;">⭐ DETAILED</span>' if has_comprehensive_info else ''
                        
                        st.markdown(f"""
                        <div class="tool-card">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                                <h4 style="margin: 0; flex: 1;">{icon} <span class="{css_class}">{tool}</span></h4>
                                <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                                    {comprehensive_badge}
                                    {badges_html}
                                </div>
                            </div>
                            <div style="margin-bottom: 0.8rem; font-size: 0.9rem; color: #555; line-height: 1.4;">
                                {description_preview}
                            </div>
                        """, unsafe_allow_html=True)
                        
                        if key_features_text:
                            st.markdown(f"""
                            <div style='margin-bottom: 0.8rem; font-size: 0.85rem; color: #666; border-left: 3px solid #007bff; padding-left: 8px;'>
                                <strong>⚡ Key Features:</strong><br>{key_features_text}
                            </div>
                            """, unsafe_allow_html=True)
                        
                        # API calls preview (if available)
                        if tool_info.get('primary_api_calls'):
                            api_preview = tool_info['primary_api_calls'][:2]  # Show first 2 API calls
                            # Clean API calls and get just the endpoint part
                            cleaned_apis = [clean_text_content(api.split(' - ')[0]) for api in api_preview]
                            api_text = ' • '.join(cleaned_apis)
                            st.markdown(f"""
                            <div style='margin-bottom: 0.8rem; font-size: 0.82rem; color: #495057; background: #f8f9fa; padding: 6px 8px; border-radius: 4px;'>
                                <strong>🔌 API Endpoints:</strong> {api_text}
                            </div>
                            """, unsafe_allow_html=True)
                        
                        # Status and metadata row
                        issues_text = status_info.get('issues', 'None')
                        if len(issues_text) > 30:
                            issues_text = issues_text[:30] + "..."
                        
                        st.markdown(f"""
                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.8rem; margin-top: 0.8rem; font-size: 0.83rem; background: #f8f9fa; padding: 8px; border-radius: 6px;">
                                <div><strong>Status:</strong><br><span class="{css_class}">{status_info['status']}</span></div>
                                <div><strong>Issues:</strong><br>{issues_text}</div>
                                <div><strong>Priority:</strong><br>{status_info.get('priority', 'Not set')}</div>
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        # Action buttons
                        col1, col2, col3, col4 = st.columns([1, 1, 1, 1])
                        with col1:
                            if st.button(f"📖 Details", key=f"details_{tool}", use_container_width=True):
                                show_tool_details(tool, status_info)
                        with col2:
                            if has_comprehensive_info:
                                if st.button(f"⚡ Quick Info", key=f"quick_{tool}", use_container_width=True):
                                    show_quick_tool_info(tool, tool_info)
                        with col3:
                            if tool_info.get('primary_api_calls'):
                                if st.button(f"🔌 API", key=f"api_{tool}", use_container_width=True):
                                    show_api_info(tool, tool_info)
                        with col4:
                            if 'wizard' in tool.lower():
                                st.markdown('<span style="color: #17a2b8; font-size: 0.8rem;">🧙‍♂️ Interactive</span>', unsafe_allow_html=True)

@st.cache_data
def get_comprehensive_tool_info():
    """Get comprehensive tool information including technical details"""
    return {
        'test_connection': {
            'description': 'Test OAuth2 authentication and API connectivity with the Habu Clean Room API. Returns detailed connection status and available resources.',
            'primary_api_calls': [
                'POST /oauth/token - OAuth2 token exchange',
                'GET /cleanrooms - Verify API connectivity',
                'GET /organizations/current - Validate permissions'
            ],
            'workflow_steps': [
                '1. Initialize OAuth2 client credentials flow',
                '2. Request access token from Habu API',
                '3. Test basic API connectivity',
                '4. Validate organization access',
                '5. Return comprehensive status report'
            ],
            'key_features': [
                'OAuth2 client credentials authentication',
                'API connectivity validation',
                'Comprehensive error diagnostics',
                'Environment configuration verification'
            ],
            'use_cases': [
                'Verify API credentials before operations',
                'Troubleshoot authentication issues',
                'Validate environment configuration',
                'System health checks'
            ],
            'response_format': 'Detailed status report with connection info, errors, and configuration validation'
        },
        'list_cleanrooms': {
            'description': 'List all available cleanrooms in the organization with their current status and metadata.',
            'primary_api_calls': [
                'GET /cleanrooms - Retrieve all cleanrooms',
                'GET /cleanrooms/{id}/status - Get status details'
            ],
            'workflow_steps': [
                '1. Authenticate with Habu API',
                '2. Fetch all cleanrooms for organization',
                '3. Retrieve status and metadata for each',
                '4. Format comprehensive cleanroom listing'
            ],
            'key_features': [
                'Complete cleanroom inventory',
                'Status and metadata display',
                'Universal ID support (UUID, Display ID, name)',
                'Organized presentation by status'
            ],
            'use_cases': [
                'Discover available cleanrooms',
                'Monitor cleanroom health status',
                'Identify cleanrooms for operations',
                'Inventory management'
            ],
            'response_format': 'Organized list with Display IDs, names, status, partner counts, and metadata'
        },
        'list_questions': {
            'description': 'List all available questions in a specific cleanroom. Accepts cleanroom name, Display ID (CR-XXXXXX), or UUID.',
            'primary_api_calls': [
                'GET /cleanrooms/{id}/questions - Retrieve questions',
                'GET /questions/{id}/details - Get question metadata'
            ],
            'workflow_steps': [
                '1. Resolve cleanroom identifier (name/Display ID/UUID)',
                '2. Fetch all questions in cleanroom',
                '3. Retrieve metadata for each question',
                '4. Format comprehensive question listing'
            ],
            'key_features': [
                'Universal cleanroom ID resolution',
                'Complete question inventory',
                'Metadata and configuration details',
                'Execution status tracking'
            ],
            'use_cases': [
                'Discover available analytics questions',
                'Monitor question execution status',
                'Identify questions for runs',
                'Question inventory management'
            ],
            'response_format': 'Detailed question list with Display IDs, descriptions, parameters, and status'
        },
        'configure_data_connection_fields': {
            'description': 'Configure field mappings for a data connection that is in "Mapping Required" status. Applies intelligent field mapping with PII detection and data type optimization.',
            'primary_api_calls': [
                'GET /data-connections/{id}/schema - Retrieve connection schema',
                'POST /data-connections/{id}/field-mappings - Apply mappings',
                'GET /data-connections/{id}/status - Check mapping status'
            ],
            'workflow_steps': [
                '1. Resolve data connection by name or ID',
                '2. Analyze current schema and field types',
                '3. Apply intelligent field mapping algorithm',
                '4. Detect and flag PII fields automatically',
                '5. Set user identifier fields',
                '6. Validate and apply configuration'
            ],
            'key_features': [
                'Intelligent field mapping with ML detection',
                'Automatic PII field identification',
                'Data type optimization',
                'User identifier field setup',
                'Dry-run preview mode'
            ],
            'use_cases': [
                'Complete data connection setup',
                'Optimize field mappings for performance',
                'Ensure PII compliance',
                'Automate connection configuration'
            ],
            'response_format': 'Field mapping summary with PII flags, data types, and configuration status'
        },
        'complete_data_connection_setup': {
            'description': 'Complete the full data connection setup by monitoring status and automatically applying field mapping when ready. Use this after creating a data connection to finish the entire workflow.',
            'primary_api_calls': [
                'GET /data-connections/{id}/status - Monitor validation progress',
                'POST /data-connections/{id}/field-mappings - Apply mappings when ready',
                'GET /data-connections/{id}/health - Verify final status'
            ],
            'workflow_steps': [
                '1. Monitor connection validation status',
                '2. Wait for "Mapping Required" status',
                '3. Automatically apply intelligent field mapping',
                '4. Verify connection health and readiness',
                '5. Return comprehensive setup summary'
            ],
            'key_features': [
                'End-to-end automation',
                'Status monitoring with polling',
                'Automatic field mapping application',
                'Health verification',
                'Complete workflow orchestration'
            ],
            'use_cases': [
                'Fully automated connection setup',
                'Hands-off data onboarding',
                'Ensure connection readiness',
                'Streamline data workflows'
            ],
            'response_format': 'Complete setup status with all validation steps, mappings, and final configuration'
        },
        'create_aws_s3_connection': {
            'description': 'Create a Client-Hosted AWS S3 data connection in LiveRamp Clean Room. Set autoComplete=true for fully autonomous setup including credential creation, connection validation, and intelligent field mapping.',
            'primary_api_calls': [
                'POST /credentials - Create AWS credentials',
                'POST /data-connections - Create S3 connection',
                'GET /data-connections/{id}/status - Monitor validation',
                'POST /data-connections/{id}/field-mappings - Apply mappings'
            ],
            'workflow_steps': [
                '1. Create or reuse AWS credentials',
                '2. Configure S3 bucket and path settings',
                '3. Create data connection with metadata',
                '4. Monitor validation progress',
                '5. Apply intelligent field mapping',
                '6. Verify connection health'
            ],
            'key_features': [
                'AWS credential management',
                'S3 bucket configuration',
                'Multiple file format support (CSV, Parquet, Delta)',
                'Automatic schema inference',
                'Field partitioning support',
                'End-to-end automation option'
            ],
            'use_cases': [
                'Connect S3 data sources to clean rooms',
                'Automate AWS data integration',
                'Set up partitioned datasets',
                'Enable multi-format data processing'
            ],
            'response_format': 'Connection details with credentials, validation status, and field mapping summary'
        },
        'invite_partner_to_cleanroom': {
            'description': 'Send partner invitations to a clean room with guided setup and validation. Handles email validation, duplicate checking, and provides setup guidance.',
            'primary_api_calls': [
                'POST /cleanrooms/{id}/invitations - Send invitation',
                'GET /cleanrooms/{id}/partners - Check existing partners',
                'GET /invitations/{id}/status - Monitor invitation status'
            ],
            'workflow_steps': [
                '1. Resolve cleanroom by name/Display ID/UUID',
                '2. Validate partner email format',
                '3. Check for duplicate invitations',
                '4. Send invitation with custom message',
                '5. Set initial role permissions',
                '6. Provide setup guidance'
            ],
            'key_features': [
                'Email validation and duplicate prevention',
                'Custom invitation messages',
                'Role-based permission assignment',
                'Self-invitation support for demos',
                'Status tracking and monitoring'
            ],
            'use_cases': [
                'Onboard new partners to cleanrooms',
                'Manage partner access and roles',
                'Demo cleanroom setup',
                'Partner collaboration workflows'
            ],
            'response_format': 'Invitation status with partner details, permissions, and next steps guidance'
        },
        'execute_question_run': {
            'description': 'Execute a question run with intelligent partition parameter detection. Automatically detects when date range filtering is required based on question SQL analysis.',
            'primary_api_calls': [
                'POST /cleanrooms/{id}/questions/{id}/runs - Execute question',
                'GET /questions/{id}/parameters - Analyze required parameters',
                'GET /runs/{id}/status - Monitor execution progress'
            ],
            'workflow_steps': [
                '1. Resolve cleanroom and question identifiers',
                '2. Analyze question SQL for partition requirements',
                '3. Apply runtime and partition parameters',
                '4. Submit question for execution',
                '5. Monitor progress (optional)',
                '6. Return execution summary'
            ],
            'key_features': [
                'Intelligent parameter detection',
                'SQL analysis for partition requirements',
                'Date range validation',
                'Progress monitoring options',
                'Execution optimization'
            ],
            'use_cases': [
                'Run analytics questions with proper parameters',
                'Execute data analysis workflows',
                'Generate business insights',
                'Automate reporting processes'
            ],
            'response_format': 'Execution details with run ID, parameters, estimated completion time, and monitoring options'
        },
        # Add more comprehensive tool entries for common tools
        'start_aws_s3_connection_wizard': {
            'description': 'Interactive wizard to guide you through creating AWS S3 data connections step-by-step. Supports both single and multiple connection creation with batch collection and sequential processing.',
            'key_features': [
                'Step-by-step wizard interface',
                'Batch connection creation support',
                'Interactive guidance and validation',
                'Error handling and retry logic'
            ]
        },
        'create_bigquery_connection_wizard': {
            'description': 'Interactive wizard for creating Google BigQuery data connections with step-by-step configuration, authentication validation, and table access setup.',
            'key_features': [
                'BigQuery authentication setup',
                'Table and dataset configuration',
                'Authorized view support',
                'Step-by-step guidance'
            ]
        },
        'start_clean_room_creation_wizard': {
            'description': 'Interactive wizard for creating a new clean room with guided step-by-step configuration. Supports comprehensive clean room setup including infrastructure, privacy controls, and feature configuration.',
            'key_features': [
                'Complete clean room setup',
                'Infrastructure configuration',
                'Privacy control settings',
                'Feature enablement options'
            ]
        },
        'manage_partner_invitations': {
            'description': 'View, cancel, resend invitations with comprehensive status tracking. Provides invitation history, bulk operations, and partner communication guidance.',
            'key_features': [
                'Invitation status tracking',
                'Bulk invitation operations',
                'Partner communication tools',
                'Invitation history management'
            ]
        },
        'configure_partner_permissions': {
            'description': 'Set granular access controls and question permissions for partners. Configure role-based permissions, question-level controls, and dataset access with impact analysis.',
            'key_features': [
                'Granular permission controls',
                'Role-based access management',
                'Question-level permissions',
                'Impact analysis tools'
            ]
        },
        'partner_onboarding_wizard': {
            'description': 'Step-by-step partner setup guidance and coordination. Handles multi-partner onboarding with progress tracking, automated follow-up, and setup verification.',
            'key_features': [
                'Multi-partner onboarding',
                'Progress tracking system',
                'Automated follow-up reminders',
                'Setup verification tools'
            ]
        },
        'deploy_question_to_cleanroom': {
            'description': 'Deploy analytical questions to clean rooms with dataset mapping, parameter configuration, and permission setup. Handles question provisioning and validation.',
            'key_features': [
                'Question deployment automation',
                'Dataset mapping configuration',
                'Parameter setup and validation',
                'Permission configuration'
            ]
        },
        'question_management_wizard': {
            'description': 'Interactive question deployment and configuration wizard. Guides through question selection, dataset mapping, parameter configuration, and permission setup.',
            'key_features': [
                'Interactive question setup',
                'Dataset mapping wizard',
                'Parameter configuration guide',
                'Permission setup assistance'
            ]
        },
        'manage_question_permissions': {
            'description': 'Configure question-specific permissions and access controls. Set who can view, edit, clone, run questions with granular partner-specific controls.',
            'key_features': [
                'Question-specific permissions',
                'Partner access controls',
                'Granular permission settings',
                'Access control templates'
            ]
        },
        'question_scheduling_wizard': {
            'description': 'Set up automated question runs with parameters and scheduling. Configure recurring execution, monitoring, and result delivery workflows.',
            'key_features': [
                'Automated question scheduling',
                'Recurring execution setup',
                'Result delivery configuration',
                'Monitoring and alerting'
            ]
        },
        
        # Dataset Management Tools
        'provision_dataset_to_cleanroom': {
            'description': 'Add datasets to clean rooms with field control and configuration. Configure dataset access, field visibility, and security controls.',
            'primary_api_calls': [
                'POST /cleanrooms/{id}/datasets - Add dataset to cleanroom',
                'PUT /datasets/{id}/permissions - Configure access controls',
                'GET /datasets/{id}/schema - Validate schema compatibility'
            ],
            'workflow_steps': [
                '1. Resolve cleanroom and dataset identifiers',
                '2. Validate dataset schema compatibility',
                '3. Configure field visibility and access controls',
                '4. Apply data transformations if needed',
                '5. Provision dataset to cleanroom',
                '6. Verify partner access permissions'
            ],
            'key_features': [
                'Dataset provisioning automation',
                'Field-level access controls',
                'Schema compatibility validation',
                'Partner permission management',
                'Data transformation support'
            ],
            'use_cases': [
                'Add new data sources to analytics workflows',
                'Configure partner data access',
                'Implement data governance policies',
                'Enable cross-partner data collaboration'
            ],
            'response_format': 'Dataset provisioning status with field mappings, access controls, and partner permissions'
        },
        'dataset_configuration_wizard': {
            'description': 'Interactive wizard to map datasets to questions with macro configuration. Guide through dataset assignment and field mapping for optimal question performance.',
            'primary_api_calls': [
                'GET /questions/{id}/requirements - Analyze question data needs',
                'POST /datasets/{id}/field-mappings - Configure field mappings',
                'PUT /questions/{id}/dataset-mappings - Assign datasets to questions'
            ],
            'workflow_steps': [
                '1. Analyze question data requirements',
                '2. Select appropriate datasets',
                '3. Configure field mappings between dataset and question',
                '4. Set up macro configurations for data processing',
                '5. Validate mappings and performance',
                '6. Activate dataset-question associations'
            ],
            'key_features': [
                'Interactive dataset mapping',
                'Field mapping wizard',
                'Macro configuration support',
                'Performance optimization',
                'Validation and testing'
            ],
            'use_cases': [
                'Optimize question performance',
                'Map complex datasets to analytics',
                'Configure data processing macros',
                'Ensure data compatibility'
            ],
            'response_format': 'Dataset configuration summary with field mappings, macro settings, and validation results'
        },
        'manage_dataset_permissions': {
            'description': 'Control dataset access and field visibility. Configure partner access to datasets with granular field-level controls and privacy settings.',
            'primary_api_calls': [
                'GET /datasets/{id}/permissions - Retrieve current permissions',
                'PUT /datasets/{id}/field-permissions - Set field-level controls',
                'POST /datasets/{id}/partner-permissions - Configure partner access'
            ],
            'key_features': [
                'Granular field-level permissions',
                'Partner-specific access controls',
                'Privacy compliance enforcement',
                'Permission template system'
            ],
            'use_cases': [
                'Implement data governance policies',
                'Control partner data access',
                'Ensure privacy compliance',
                'Manage sensitive data exposure'
            ]
        },
        'dataset_transformation_wizard': {
            'description': 'Apply transformations and create derived fields. Interactive wizard for data transformation, field creation, and advanced dataset preparation.',
            'key_features': [
                'Data transformation workflows',
                'Derived field creation',
                'Interactive transformation wizard',
                'Preview and validation'
            ],
            'use_cases': [
                'Create calculated fields',
                'Apply data cleansing rules',
                'Prepare data for analytics',
                'Enhance dataset value'
            ]
        },
        
        # Execution & Results Tools
        'check_question_run_status': {
            'description': 'Check the current status of one or more question runs with execution details and completion times. Provides point-in-time status reports for specific run IDs.',
            'primary_api_calls': [
                'GET /runs/{id}/status - Get run execution status',
                'GET /runs/{id}/progress - Monitor execution progress',
                'GET /runs/{id}/logs - Retrieve execution logs'
            ],
            'workflow_steps': [
                '1. Resolve run IDs from input parameters',
                '2. Query execution status for each run',
                '3. Analyze progress and completion estimates',
                '4. Check for errors or issues',
                '5. Format comprehensive status report'
            ],
            'key_features': [
                'Real-time status monitoring',
                'Progress tracking with estimates',
                'Error detection and reporting',
                'Bulk status checking',
                'Automatic refresh capabilities'
            ],
            'use_cases': [
                'Monitor long-running analytics',
                'Track question execution progress',
                'Identify and troubleshoot failures',
                'Manage execution workflows'
            ],
            'response_format': 'Detailed status report with execution progress, estimated completion times, and any error details'
        },
        'results_access_and_export': {
            'description': 'Retrieve, format, and export question results with multiple output formats and advanced filtering capabilities.',
            'primary_api_calls': [
                'GET /runs/{id}/results - Retrieve question results',
                'POST /exports - Create export job',
                'GET /exports/{id}/download - Download exported results'
            ],
            'workflow_steps': [
                '1. Verify run completion and result availability',
                '2. Apply filtering criteria if specified',
                '3. Format results according to requested output type',
                '4. Apply column selection and data transformations',
                '5. Generate export in requested format',
                '6. Provide download links or file paths'
            ],
            'key_features': [
                'Multiple export formats (JSON, CSV, Excel)',
                'Advanced filtering and column selection',
                'Data transformation capabilities',
                'Secure result access controls',
                'Bulk export operations'
            ],
            'use_cases': [
                'Export analytics results for reporting',
                'Integrate with external BI tools',
                'Create custom data extracts',
                'Share results with stakeholders'
            ],
            'response_format': 'Export details with format options, download links, and data access information'
        },
        'scheduled_run_management': {
            'description': 'Manage recurring question executions with comprehensive scheduling, monitoring, and optimization capabilities.',
            'primary_api_calls': [
                'GET /schedules - List existing schedules',
                'POST /schedules - Create new schedule',
                'PUT /schedules/{id} - Update schedule configuration',
                'DELETE /schedules/{id} - Remove schedule'
            ],
            'key_features': [
                'Recurring execution scheduling',
                'Schedule lifecycle management',
                'Execution monitoring and alerting',
                'Performance optimization'
            ],
            'use_cases': [
                'Automate regular reporting',
                'Schedule data refreshes',
                'Implement monitoring workflows',
                'Manage execution resources'
            ]
        },
        
        # Clean Room Lifecycle Tools
        'update_cleanroom_configuration': {
            'description': 'Modify clean room settings and parameters with validation, impact analysis, and rollback capabilities.',
            'primary_api_calls': [
                'PUT /cleanrooms/{id}/configuration - Update settings',
                'GET /cleanrooms/{id}/validation - Validate changes',
                'POST /cleanrooms/{id}/backup - Create configuration backup'
            ],
            'workflow_steps': [
                '1. Create backup of current configuration',
                '2. Validate proposed changes for compatibility',
                '3. Analyze impact on existing workflows',
                '4. Apply configuration updates',
                '5. Verify system stability',
                '6. Provide rollback capability if needed'
            ],
            'key_features': [
                'Configuration backup and restore',
                'Change validation and impact analysis',
                'Zero-downtime updates',
                'Rollback capabilities',
                'Audit trail for changes'
            ],
            'use_cases': [
                'Update privacy controls and thresholds',
                'Modify clean room features and capabilities',
                'Adjust infrastructure settings',
                'Implement governance policy changes'
            ],
            'response_format': 'Configuration update status with validation results, impact analysis, and rollback information'
        },
        'cleanroom_health_monitoring': {
            'description': 'Monitor clean room status, usage, performance metrics, and generate comprehensive health reports.',
            'primary_api_calls': [
                'GET /cleanrooms/{id}/health - Health status overview',
                'GET /cleanrooms/{id}/metrics - Performance metrics',
                'GET /cleanrooms/{id}/usage - Usage statistics'
            ],
            'key_features': [
                'Real-time health monitoring',
                'Performance metrics and analytics',
                'Usage tracking and reporting',
                'Alert generation for issues'
            ],
            'use_cases': [
                'Monitor clean room performance',
                'Track usage patterns and trends',
                'Generate compliance reports',
                'Identify optimization opportunities'
            ]
        },
        'cleanroom_lifecycle_manager': {
            'description': 'Handle clean room archival, reactivation, and cleanup with compliance-aware procedures and data preservation.',
            'key_features': [
                'Lifecycle state management',
                'Data preservation policies',
                'Compliance-aware procedures',
                'Partner notification system'
            ],
            'use_cases': [
                'Archive completed projects',
                'Manage clean room retirement',
                'Ensure compliance during lifecycle changes',
                'Coordinate partner communications'
            ]
        },
        'cleanroom_access_audit': {
            'description': 'Track user access and activity logs with comprehensive audit reporting and security incident detection.',
            'key_features': [
                'Comprehensive access logging',
                'Security incident detection',
                'Audit report generation',
                'Compliance documentation'
            ],
            'use_cases': [
                'Security compliance auditing',
                'Track user activity patterns',
                'Investigate security incidents',
                'Generate regulatory reports'
            ]
        },
        
        # Multi-Cloud Data Connection Tools
        'create_snowflake_connection_wizard': {
            'description': 'Interactive wizard for creating Snowflake data connections with step-by-step configuration, authentication validation, and performance optimization.',
            'primary_api_calls': [
                'POST /credentials/snowflake - Create Snowflake credentials',
                'POST /data-connections/snowflake - Create connection',
                'GET /snowflake/validation - Test connection'
            ],
            'workflow_steps': [
                '1. Collect Snowflake account and authentication details',
                '2. Configure database, schema, and warehouse settings',
                '3. Validate connection and credentials',
                '4. Optimize performance settings',
                '5. Test data access and permissions',
                '6. Complete connection setup'
            ],
            'key_features': [
                'Step-by-step Snowflake setup',
                'Authentication validation',
                'Performance optimization',
                'Connection testing and verification'
            ],
            'use_cases': [
                'Connect Snowflake data warehouses',
                'Enable cloud data collaboration',
                'Integrate enterprise data sources',
                'Set up secure data sharing'
            ],
            'response_format': 'Connection details with authentication status, performance settings, and validation results'
        },
        'create_databricks_connection_wizard': {
            'description': 'Interactive wizard for creating Databricks data connections with Delta Lake support, cluster configuration, and performance tuning.',
            'key_features': [
                'Databricks cluster configuration',
                'Delta Lake integration',
                'Performance tuning options',
                'Unity Catalog support'
            ],
            'use_cases': [
                'Connect Databricks workspaces',
                'Enable Delta Lake data sources',
                'Integrate ML and analytics workflows',
                'Access Unity Catalog data'
            ]
        },
        'create_gcs_connection_wizard': {
            'description': 'Interactive wizard for creating Google Cloud Storage connections with IAM configuration, BigQuery integration, and security best practices.',
            'key_features': [
                'GCS bucket configuration',
                'IAM and service account setup',
                'BigQuery integration options',
                'Security best practices'
            ],
            'use_cases': [
                'Connect Google Cloud data sources',
                'Integrate with BigQuery workflows',
                'Enable multi-cloud data access',
                'Implement secure data sharing'
            ]
        },
        'create_azure_connection_wizard': {
            'description': 'Interactive wizard for creating Microsoft Azure data connections with Azure AD authentication, Synapse integration, and Data Lake support.',
            'key_features': [
                'Azure Blob Storage configuration',
                'Azure AD authentication',
                'Synapse Analytics integration',
                'Data Lake support'
            ],
            'use_cases': [
                'Connect Azure data platforms',
                'Enable enterprise data integration',
                'Support hybrid cloud architectures',
                'Integrate with Microsoft ecosystem'
            ]
        },
        'data_connection_health_monitor': {
            'description': 'Monitor data connection status and performance across multiple cloud providers with automated health checks and alerting.',
            'primary_api_calls': [
                'GET /data-connections/health - Overall health status',
                'GET /data-connections/{id}/metrics - Connection metrics',
                'POST /data-connections/{id}/test - Run health checks'
            ],
            'key_features': [
                'Multi-cloud monitoring',
                'Automated health checks',
                'Performance metrics tracking',
                'Alert generation for issues'
            ],
            'use_cases': [
                'Monitor data connection reliability',
                'Track performance across providers',
                'Ensure data availability',
                'Proactive issue detection'
            ]
        },
        
        # Enterprise Tools
        'data_export_workflow_manager': {
            'description': 'Complete data export job lifecycle management including creation, monitoring, and result delivery configuration. Handles secure export of clean room results to approved destinations.',
            'primary_api_calls': [
                'POST /export-jobs - Create export workflow',
                'GET /export-jobs/{id}/status - Monitor progress',
                'GET /export-jobs/{id}/results - Access exported data'
            ],
            'workflow_steps': [
                '1. Configure export destination and format',
                '2. Set up security and encryption settings',
                '3. Create and submit export job',
                '4. Monitor export progress',
                '5. Validate exported data integrity',
                '6. Deliver results to approved destinations'
            ],
            'key_features': [
                'Secure export workflows',
                'Multiple destination support',
                'Encryption and compliance',
                'Progress monitoring and validation'
            ],
            'use_cases': [
                'Export to external BI tools',
                'Create secure data deliveries',
                'Automate reporting workflows',
                'Ensure compliance in data sharing'
            ],
            'response_format': 'Export workflow status with job details, progress tracking, and delivery confirmation'
        },
        'execution_template_manager': {
            'description': 'Create, manage, and execute reusable execution templates for complex clean room workflows. Enables advanced automation and standardized processes.',
            'primary_api_calls': [
                'POST /execution-templates - Create template',
                'GET /execution-templates - List templates',
                'POST /execution-templates/{id}/execute - Run template'
            ],
            'key_features': [
                'Reusable workflow templates',
                'Multi-question orchestration',
                'Parameter management',
                'Execution automation'
            ],
            'use_cases': [
                'Standardize complex workflows',
                'Automate multi-step processes',
                'Enable workflow reusability',
                'Orchestrate dependent executions'
            ]
        },
        'advanced_user_management': {
            'description': 'Advanced user management for bulk operations including role assignments, permissions management, and user lifecycle operations.',
            'primary_api_calls': [
                'GET /users - List all users',
                'PUT /users/{id}/roles - Manage user roles',
                'POST /users/bulk-operations - Bulk user operations'
            ],
            'key_features': [
                'Bulk user operations',
                'Role-based access control',
                'Permission management',
                'User lifecycle automation'
            ],
            'use_cases': [
                'Enterprise user management',
                'Bulk permission updates',
                'Role assignment automation',
                'User lifecycle management'
            ]
        },
        
        # Additional Connection Wizards
        'create_google_ads_data_hub_wizard': {
            'description': 'Interactive wizard for creating Google Ads Data Hub (ADH) data connections with step-by-step configuration, OAuth2 authentication, and ADH project setup.',
            'key_features': [
                'ADH project configuration',
                'OAuth2 authentication setup',
                'Query permission management',
                'Customer ID validation'
            ],
            'use_cases': [
                'Connect Google Ads data sources',
                'Enable advertising analytics',
                'Access ADH query capabilities',
                'Integrate with marketing workflows'
            ]
        },
        'create_amazon_marketing_cloud_wizard': {
            'description': 'Interactive wizard for creating Amazon Marketing Cloud (AMC) data connections with step-by-step configuration, Amazon Advertising API authentication, and AMC instance setup.',
            'key_features': [
                'AMC instance configuration',
                'Amazon Advertising API setup',
                'AWS integration for data export',
                'Multi-region support'
            ],
            'use_cases': [
                'Connect Amazon advertising data',
                'Enable AMC analytics workflows',
                'Integrate with AWS data services',
                'Access Amazon marketing insights'
            ]
        },
        'create_snowflake_data_share_wizard': {
            'description': 'Interactive wizard for creating Snowflake Data Share connections with step-by-step configuration, cross-account sharing, and enterprise data collaboration setup.',
            'key_features': [
                'Cross-account data sharing',
                'Secure data collaboration',
                'Share provider configuration',
                'Access level management'
            ],
            'use_cases': [
                'Enable secure data sharing',
                'Connect external Snowflake accounts',
                'Facilitate data collaboration',
                'Access shared datasets'
            ]
        },
        'create_snowflake_secure_views_wizard': {
            'description': 'Interactive wizard for creating Snowflake Secure Views connections with step-by-step configuration, privacy controls, and data masking setup.',
            'key_features': [
                'Secure view configuration',
                'Data masking and privacy controls',
                'Column-level security',
                'Privacy policy enforcement'
            ],
            'use_cases': [
                'Implement data privacy controls',
                'Enable secure data access',
                'Apply column-level masking',
                'Ensure compliance requirements'
            ]
        },
        'create_hubspot_connection_wizard': {
            'description': 'Interactive wizard for creating HubSpot CRM data connections with step-by-step configuration, OAuth2 authentication, and portal setup.',
            'key_features': [
                'HubSpot portal configuration',
                'CRM object access management',
                'Property mapping automation',
                'Sync frequency configuration'
            ],
            'use_cases': [
                'Connect HubSpot CRM data',
                'Enable marketing analytics',
                'Access customer data',
                'Integrate sales workflows'
            ]
        },
        'create_salesforce_connection_wizard': {
            'description': 'Interactive wizard for creating Salesforce CRM data connections with step-by-step configuration, OAuth2 authentication, and organization setup.',
            'key_features': [
                'Salesforce org configuration',
                'Object permission management',
                'Query type optimization',
                'Connected app setup'
            ],
            'use_cases': [
                'Connect Salesforce CRM data',
                'Enable sales analytics',
                'Access customer records',
                'Integrate with enterprise workflows'
            ]
        },
        
        # Additional Supporting Tools
        'list_credentials': {
            'description': 'List all available organization credentials with their types, sources, and status information.',
            'key_features': [
                'Credential inventory management',
                'Status monitoring',
                'Type categorization',
                'Security compliance tracking'
            ],
            'use_cases': [
                'Audit credential usage',
                'Monitor credential health',
                'Manage authentication assets',
                'Ensure security compliance'
            ]
        },
        'list_data_connections': {
            'description': 'List all available data connections with their configuration status, types, and metadata. Note: Only returns user-created connections, not system-managed synthetic datasets.',
            'key_features': [
                'Connection inventory',
                'Status and health monitoring',
                'Type and provider categorization',
                'Configuration metadata display'
            ],
            'use_cases': [
                'Inventory data connections',
                'Monitor connection health',
                'Identify available data sources',
                'Manage connection lifecycle'
            ]
        }
    }

def get_default_tool_info(tool_name):
    """Get default tool information for tools not in the comprehensive database"""
    return {
        'description': f'Advanced workflow tool for {tool_name.replace("_", " ").title()}. Part of the comprehensive Habu MCP Server toolkit for enterprise clean room management.',
        'key_features': [
            'Enterprise-grade workflow automation',
            'Production API integration',
            'Comprehensive error handling',
            'Real-time status monitoring'
        ]
    }

def show_quick_tool_info(tool_name, tool_info):
    """Show quick overview of tool information in a compact format"""
    st.markdown(f"### ⚡ Quick Info: {tool_name}")
    
    col1, col2 = st.columns(2)
    
    with col1:
        if tool_info.get('key_features'):
            st.markdown("#### 🎯 Key Features")
            for feature in tool_info['key_features'][:5]:  # Show first 5 features
                st.markdown(f"• {feature}")
    
    with col2:
        if tool_info.get('use_cases'):
            st.markdown("#### 🚀 Use Cases")
            for use_case in tool_info['use_cases'][:4]:  # Show first 4 use cases
                st.markdown(f"• {use_case}")
    
    if tool_info.get('workflow_steps'):
        st.markdown("#### 🔄 Workflow Overview")
        for i, step in enumerate(tool_info['workflow_steps'][:4], 1):  # Show first 4 steps
            st.markdown(f"{step}")

def show_api_info(tool_name, tool_info):
    """Show API information for a tool"""
    st.markdown(f"### 🔌 API Details: {tool_name}")
    
    if tool_info.get('primary_api_calls'):
        st.markdown("#### API Endpoints")
        for api_call in tool_info['primary_api_calls']:
            # Parse API call format: "METHOD /endpoint - Description"
            if ' - ' in api_call:
                endpoint, description = api_call.split(' - ', 1)
                st.code(endpoint, language='http')
                st.markdown(f"_{description}_")
            else:
                st.code(api_call, language='http')
    
    if tool_info.get('response_format'):
        st.markdown("#### Response Format")
        st.info(tool_info['response_format'])

def show_tool_details(tool_name, status_info):
    """Show comprehensive information about a specific tool"""
    st.markdown(f"### 🔧 {tool_name}")
    
    # Get comprehensive tool info
    tool_info = get_comprehensive_tool_info().get(tool_name, {})
    
    # Testing Status Section
    st.markdown("#### 📊 Testing Status")
    col1, col2 = st.columns(2)
    with col1:
        status_color = "🟢" if "Verified" in status_info['status'] else "🟡" if "Complete" in status_info['status'] else "🔴" if "issue" in status_info.get('status_category', '') else "⚪"
        st.markdown(f"**Status:** {status_color} {status_info['status']}")
        st.markdown(f"**Category:** {status_info['status_category'].title()}")
    with col2:
        st.markdown(f"**Issues:** {status_info.get('issues', 'None')}")
        st.markdown(f"**Priority:** {status_info.get('priority', 'Not set')}")
    
    # Tool Description Section
    if tool_info.get('description'):
        st.markdown("#### 📖 What This Tool Does")
        st.info(tool_info['description'])
    
    # Technical Architecture Section
    col1, col2 = st.columns(2)
    
    with col1:
        if tool_info.get('primary_api_calls'):
            st.markdown("#### 🔌 API Calls")
            for api_call in tool_info['primary_api_calls']:
                st.markdown(f"• `{api_call}`")
        
        if tool_info.get('key_features'):
            st.markdown("#### ⚡ Key Features")
            for feature in tool_info['key_features']:
                st.markdown(f"• {feature}")
    
    with col2:
        if tool_info.get('workflow_steps'):
            st.markdown("#### 🔄 Workflow Steps")
            for step in tool_info['workflow_steps']:
                st.markdown(f"{step}")
        
        if tool_info.get('use_cases'):
            st.markdown("#### 🎯 Use Cases")
            for use_case in tool_info['use_cases']:
                st.markdown(f"• {use_case}")
    
    # Response Format
    if tool_info.get('response_format'):
        st.markdown("#### 📄 Response Format")
        st.code(tool_info['response_format'], language='text')
    
    # Testing Details Section (if available)
    if 'detailed_status' in status_info:
        st.markdown("#### 🧪 Testing Details")
        st.info(status_info['detailed_status'])
    
    # Working components
    if 'working_components' in status_info and status_info['working_components']:
        st.markdown("#### ✅ Working Components")
        for component in status_info['working_components']:
            st.markdown(f"• {component}")
    
    # Current issues
    if 'current_issues' in status_info and status_info['current_issues']:
        st.markdown("#### ❌ Current Issues")
        for issue in status_info['current_issues']:
            st.markdown(f"• {issue}")
    
    # Technical details from testing
    if 'technical_details' in status_info:
        st.markdown("#### 🔍 Technical Testing Details")
        st.code(status_info['technical_details'])
    
    # Next steps
    if 'next_steps' in status_info and status_info['next_steps']:
        st.markdown("#### 🎯 Next Steps")
        for step in status_info['next_steps']:
            st.markdown(f"• {step}")

def show_testing_dashboard():
    st.header("📊 Testing Dashboard")
    
    # Parse testing data
    tool_status = parse_tool_testing_status()
    completed_tools = parse_testing_progress()
    
    # Create comprehensive status data
    all_tools = []
    categories = get_tool_categories()
    
    # Flatten all tools with categories
    for category, tools in categories.items():
        for tool in tools:
            all_tools.append({
                'tool': tool,
                'category': category.split(' (')[0],  # Remove count
                'status': 'untested'
            })
    
    # Update with actual status
    for tool_data in all_tools:
        tool_name = tool_data['tool']
        
        # Check in tool_status first
        for status_tool in tool_status:
            if status_tool['name'] == tool_name:
                tool_data['status'] = status_tool.get('status_category', 'untested')
                break
        
        # Check in completed_tools
        for completed_tool in completed_tools:
            if completed_tool['name'] == tool_name:
                tool_data['status'] = 'verified'
                break
    
    # Create DataFrame
    df = pd.DataFrame(all_tools)
    
    # Overall statistics
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📈 Testing Progress")
        status_counts = df['status'].value_counts()
        
        # Create pie chart
        fig = px.pie(
            values=status_counts.values, 
            names=status_counts.index,
            color_discrete_map={
                'verified': '#28a745',
                'partial': '#ffc107', 
                'issue': '#dc3545',
                'untested': '#6c757d'
            },
            title="Tool Testing Status Distribution"
        )
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.subheader("📊 Progress by Category")
        category_status = df.groupby(['category', 'status']).size().unstack(fill_value=0)
        
        # Create stacked bar chart
        fig = go.Figure()
        
        colors = {'verified': '#28a745', 'partial': '#ffc107', 'issue': '#dc3545', 'untested': '#6c757d'}
        for status in category_status.columns:
            fig.add_trace(go.Bar(
                name=status.title(),
                x=category_status.index,
                y=category_status[status],
                marker_color=colors.get(status, '#6c757d')
            ))
        
        fig.update_layout(
            barmode='stack',
            title="Testing Status by Category",
            xaxis_tickangle=-45
        )
        st.plotly_chart(fig, use_container_width=True)
    
    # Detailed status table
    st.subheader("📋 Detailed Testing Status")
    
    # Filter options
    col1, col2 = st.columns(2)
    with col1:
        selected_category = st.selectbox("Filter by Category:", ["All"] + list(df['category'].unique()))
    with col2:
        selected_status = st.selectbox("Filter by Status:", ["All"] + list(df['status'].unique()))
    
    # Apply filters
    filtered_df = df.copy()
    if selected_category != "All":
        filtered_df = filtered_df[filtered_df['category'] == selected_category]
    if selected_status != "All":
        filtered_df = filtered_df[filtered_df['status'] == selected_status]
    
    # Display filtered table
    st.dataframe(filtered_df, use_container_width=True)
    
    # Key metrics
    st.subheader("🎯 Key Metrics")
    verified_count = len(df[df['status'] == 'verified'])
    total_count = len(df)
    completion_rate = (verified_count / total_count) * 100
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Tools Verified", f"{verified_count}/{total_count}", f"{completion_rate:.1f}%")
    with col2:
        partial_count = len(df[df['status'] == 'partial'])
        st.metric("Partial Testing", partial_count)
    with col3:
        issue_count = len(df[df['status'] == 'issue'])
        st.metric("Issues Found", issue_count)

def show_key_learnings():
    st.header("🧠 Key Learnings")
    
    learnings = [
        {
            "title": "🔐 OAuth2 Authentication",
            "description": "After extensive testing, discovered the correct OAuth2 implementation: Secondary API key = CLIENT_ID, Primary API key = CLIENT_SECRET. This enabled production API access.",
            "impact": "100% authentication reliability with production credentials"
        },
        {
            "title": "🎯 Universal Name Resolution Success",
            "description": "Implemented name-based lookup across all 28 cleanroom-dependent tools. Users can now use 'Media Intelligence Demo' instead of cryptic UUIDs like '1f901228-c59d...'",
            "impact": "Eliminated primary user friction point, made platform accessible to non-technical users"
        },
        {
            "title": "🧠 Smart Parameter Detection Innovation",
            "description": "Real-time SQL analysis automatically detects required partition parameters, eliminating zero-result queries and providing educational guidance.",
            "impact": "Enhanced user experience with intelligent guidance for all question types"
        },
        {
            "title": "🤝 End-to-End Partner Collaboration",
            "description": "Successfully validated complete partner invitation workflow: invitation → email delivery → acceptance → UI changes. Discovered requirement for existing Habu accounts.",
            "impact": "100% validated partner onboarding process with real business impact"
        },
        {
            "title": "🔧 Connection Type Compatibility",
            "description": "Discovered that some tools work with specific connection types (e.g., Client AWS S3) but may not support all connection types (e.g., Synthetic Dataset Library).",
            "impact": "Need for clearer tool scope documentation and connection type validation"
        },
        {
            "title": "🚨 AI Data Fabrication Issue",
            "description": "Critical discovery: Wizard tools accept AI-fabricated data from ANY AI agent (Claude, GPT, Gemini), potentially creating unusable connections with fake S3 paths.",
            "impact": "Universal design flaw affecting all AI agents - requires fundamental redesign"
        }
    ]
    
    for learning in learnings:
        st.markdown(f"""
        <div class="learning-card">
            <h3>{learning['title']}</h3>
            <p><strong>Discovery:</strong> {learning['description']}</p>
            <p><strong>Impact:</strong> {learning['impact']}</p>
        </div>
        """, unsafe_allow_html=True)

def show_limitations():
    st.header("⚠️ Known Limitations")
    
    limitations = [
        {
            "title": "🚨 AI Data Fabrication in Wizards",
            "severity": "CRITICAL",
            "description": "Multi-step wizards accept AI-generated fake data instead of requiring real user input. This affects ALL AI agents (Claude, GPT-4, Gemini, etc.)",
            "example": "User says 'create S3 connection for customer data' → AI fabricates 's3://fake-bucket/path' → Wizard proceeds with non-existent bucket",
            "impact": "Users could create broken connections without realizing it"
        },
        {
            "title": "📊 Testing Coverage Gap",
            "severity": "HIGH",
            "description": "Only 8/45 tools (18%) have been validated with real users. 82% of tools are built but untested.",
            "example": "37 sophisticated tools exist but lack user validation",
            "impact": "Unknown reliability and user experience for majority of platform"
        },
        {
            "title": "🔗 Connection Type Scope Uncertainty",
            "severity": "MEDIUM", 
            "description": "Some tools may only work with specific connection types (Client AWS S3 confirmed working, others uncertain).",
            "example": "configure_data_connection_fields works with AWS S3 but fails with Synthetic Dataset Library",
            "impact": "User confusion when tools don't work with their connection type"
        },
        {
            "title": "📧 Partner Invitation Dependencies",
            "severity": "MEDIUM",
            "description": "Partner invitations require invitees to have existing Habu/LiveRamp accounts for email delivery.",
            "example": "Inviting external partners fails if they don't have Habu accounts",
            "impact": "Limits collaboration to existing Habu ecosystem"
        },
        {
            "title": "🔧 API Format Requirements",
            "severity": "LOW",
            "description": "Some credential formats need debugging (e.g., BigQuery Service Account structure).",
            "example": "BigQuery wizard gets 400 errors on credential creation endpoint",
            "impact": "Some advanced tools need additional API format debugging"
        }
    ]
    
    severity_colors = {
        "CRITICAL": "#dc3545",
        "HIGH": "#fd7e14", 
        "MEDIUM": "#ffc107",
        "LOW": "#20c997"
    }
    
    for limitation in limitations:
        color = severity_colors.get(limitation['severity'], "#6c757d")
        st.markdown(f"""
        <div class="limitation-card" style="background: linear-gradient(135deg, {color} 0%, {color}aa 100%);">
            <h3>{limitation['title']}</h3>
            <p><strong>Severity:</strong> {limitation['severity']}</p>
            <p><strong>Issue:</strong> {limitation['description']}</p>
            <p><strong>Example:</strong> {limitation['example']}</p>
            <p><strong>Impact:</strong> {limitation['impact']}</p>
        </div>
        """, unsafe_allow_html=True)

def show_work_to_do():
    st.header("🎯 Work To Do")
    
    st.subheader("🚨 Critical Priority")
    critical_work = [
        "Fix AI data fabrication bug in wizard tools",
        "Implement user input validation and confirmation checkpoints", 
        "Add AI agent guards to detect placeholder data",
        "Redesign wizards for proper user interaction"
    ]
    
    for item in critical_work:
        st.markdown(f"- 🔴 **{item}**")
    
    st.subheader("📊 High Priority")
    high_priority = [
        "Continue systematic testing of remaining 37 tools",
        "Document connection type compatibility for each tool",
        "Validate execute_question_run and other core execution tools",
        "Test enterprise tools (bulk operations, templates, exports)"
    ]
    
    for item in high_priority:
        st.markdown(f"- 🟡 **{item}**")
    
    st.subheader("🔧 Medium Priority") 
    medium_priority = [
        "Debug BigQuery credential format issues",
        "Investigate connection type scope limitations",
        "Add fuzzy matching for name resolution",
        "Implement caching for name-to-UUID lookups"
    ]
    
    for item in medium_priority:
        st.markdown(f"- 🟢 **{item}**")
    
    st.subheader("📚 Documentation & Optimization")
    docs_work = [
        "Archive outdated planning documents",
        "Consolidate duplicate documentation",
        "Create user guides for validated tools",
        "Document API format requirements and examples"
    ]
    
    for item in docs_work:
        st.markdown(f"- 📝 **{item}**")
    
    # Progress tracking
    st.subheader("📈 Progress Tracking")
    
    # Calculate work completion estimates
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Critical Issues", "4 items", "Requires immediate attention")
    with col2:
        st.metric("Testing Progress", "8/45 tools", "18% complete")
    with col3:
        st.metric("Documentation", "Clean up needed", "~15 files to organize")

def show_documentation_hub():
    st.header("📚 Documentation Hub")
    st.markdown("Access all critical project documents")
    
    # Organize docs by importance
    critical_docs = {
        "🎯 Project Overview": {
            "README.md": "Main project overview and status",
            "MISSION_ACCOMPLISHED.md": "Universal name resolution achievement",
            "IMPLEMENTATION_COMPLETE_SUMMARY.md": "Enterprise platform implementation"
        },
        "🧪 Testing & Validation": {
            "MCP_TOOL_TESTING_STATUS.md": "Detailed technical testing results and issues",
            "TESTING_PROGRESS.md": "Testing methodology and progress tracking",
            "UUID_AUDIT_REPORT.md": "Analysis of name resolution enhancements"
        },
        "🔧 Technical Implementation": {
            "MCP_SERVER_CONFIGURATION.md": "Setup guide for collaborators",
            "API_COVERAGE_ANALYSIS.md": "Comprehensive API endpoint analysis",
            ".memex/rules.md": "Project rules and architecture guidelines"
        },
        "📋 Planning & History": {
            "HABU_MCP_COMPREHENSIVE_PLAN.md": "Original comprehensive development plan",
            "NEW_WIZARDS_COMPLETION_SUMMARY.md": "Latest feature additions",
            "SMART_DETECTION_BREAKTHROUGH.md": "Intelligent parameter detection"
        }
    }
    
    for section, docs in critical_docs.items():
        with st.expander(section, expanded=True):
            for filename, description in docs.items():
                col1, col2 = st.columns([3, 1])
                with col1:
                    st.markdown(f"**{filename}**")
                    st.markdown(f"_{description}_")
                with col2:
                    if st.button(f"📖 View", key=filename):
                        show_document_content(filename)

def show_document_content(filename):
    """Display document content in an expander"""
    content = load_markdown_file(filename)
    with st.expander(f"📄 {filename}", expanded=True):
        st.markdown(content)

if __name__ == "__main__":
    main()