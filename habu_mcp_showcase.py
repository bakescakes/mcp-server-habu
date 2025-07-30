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

# Page config
st.set_page_config(
    page_title="🚀 Habu MCP Server Showcase",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
)

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
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 1rem;
        margin: 0.5rem 0;
        background: #f8f9fa;
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
    st.markdown('<h1 class="main-header">🚀 Habu MCP Server Showcase</h1>', unsafe_allow_html=True)
    st.markdown('<p style="text-align: center; font-size: 1.3rem; color: #666;">Model Context Protocol Server for LiveRamp Clean Room API</p>', unsafe_allow_html=True)
    
    # Sidebar navigation
    st.sidebar.title("🧭 Navigation")
    
    # Flex mode toggle
    st.sidebar.markdown("---")
    flex_mode = st.sidebar.toggle("🚀 **FLEX MODE**", value=False, help="Emphasize achievements and success stories")
    if flex_mode:
        st.sidebar.success("Showing achievements and success stories!")
    else:
        st.sidebar.info("Showing balanced view with limitations")
    
    st.sidebar.markdown("---")
    
    page = st.sidebar.selectbox("Choose a section:", [
        "🏠 Project Overview", 
        "🛠️ MCP Tools Explorer", 
        "📊 Testing Dashboard",
        "🧠 Key Learnings", 
        "⚠️ Known Limitations", 
        "🎯 Work To Do",
        "📚 Documentation Hub"
    ])
    
    # Pass flex_mode to the functions
    if page == "🏠 Project Overview":
        show_project_overview(flex_mode)
    elif page == "🛠️ MCP Tools Explorer":
        show_tools_explorer(flex_mode)
    elif page == "📊 Testing Dashboard":
        show_testing_dashboard(flex_mode)
    elif page == "🧠 Key Learnings":
        show_key_learnings(flex_mode)
    elif page == "⚠️ Known Limitations":
        show_limitations(flex_mode)
    elif page == "🎯 Work To Do":
        show_work_to_do(flex_mode)
    elif page == "📚 Documentation Hub":
        show_documentation_hub(flex_mode)
    


def show_project_overview(flex_mode=False):
    if flex_mode:
        st.header("🚀 HABU MCP SERVER: THE ULTIMATE ACHIEVEMENT!")
        st.markdown("""
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    padding: 2rem; border-radius: 15px; color: white; text-align: center; margin: 1rem 0;">
            <h2>🏆 WE BUILT SOMETHING INCREDIBLE! 🏆</h2>
            <p style="font-size: 1.2rem;">99% API Coverage • 45 Intelligent Tools • Enterprise Ready • OAuth2 Mastery</p>
        </div>
        """, unsafe_allow_html=True)
    else:
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
        verified_count = len([t for t in tool_status if t['status_category'] == 'verified'])
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
    - **Primary Server**: `mcp-habu-runner/src/production-index.ts` (45 comprehensive tools)
    - **Authentication**: OAuth2 client credentials flow with production API
    - **Distribution**: Compiled Node.js package ready for any MCP client
    - **Coverage**: 99% of LiveRamp Clean Room API functionality
    """)
    
    # Major achievements
    st.subheader("🏆 Major Achievements")
    achievements = [
        "✅ **OAuth2 Authentication Breakthrough** - Working with production API after extensive testing",
        "✅ **Universal Name Resolution** - Users can use cleanroom names instead of cryptic UUIDs",
        "✅ **Smart Parameter Detection** - Intelligent SQL analysis prevents zero-result queries", 
        "✅ **Complete End-to-End Validation** - Partner invitation workflow fully tested",
        "✅ **Enterprise-Grade Features** - Bulk operations, templates, advanced exports",
        "✅ **99% API Coverage** - Most comprehensive clean room automation platform"
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

def show_tools_explorer(flex_mode=False):
    if flex_mode:
        st.header("🛠️ 45 POWERFUL WORKFLOW TOOLS!")
        st.markdown("### 🎯 Every Tool is a Masterpiece of API Integration")
    else:
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
    
    # Filter and search options
    st.subheader("🔍 Filter & Search")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        status_filter = st.selectbox("Filter by Status:", 
            ["All", "✅ Verified", "🟡 Partial", "❌ Issues", "⚪ Untested"])
    with col2:
        category_filter = st.selectbox("Filter by Category:", 
            ["All"] + list(categories.keys()))
    with col3:
        search_term = st.text_input("Search tools:", placeholder="e.g. connection, partner")
    
    # Apply filters
    filtered_categories = categories.copy()
    if category_filter != "All":
        filtered_categories = {category_filter: categories[category_filter]}
    
    # Display tools by category
    for category, tools in filtered_categories.items():
        # Filter tools based on search and status
        filtered_tools = []
        for tool in tools:
            status_info = status_lookup.get(tool, {
                'status': 'Not Tested',
                'status_category': 'untested',
                'issues': 'No testing data',
                'priority': '-'
            })
            
            # Apply status filter
            if status_filter != "All":
                status_map = {
                    "✅ Verified": "verified",
                    "🟡 Partial": "partial", 
                    "❌ Issues": "issue",
                    "⚪ Untested": "untested"
                }
                if status_info['status_category'] != status_map.get(status_filter):
                    continue
            
            # Apply search filter
            if search_term and search_term.lower() not in tool.lower():
                continue
                
            filtered_tools.append((tool, status_info))
        
        if filtered_tools:  # Only show category if it has matching tools
            with st.expander(f"📁 {category} ({len(filtered_tools)} tools)", expanded=True):
                for tool, status_info in filtered_tools:
                    # Status icon and color
                    status_cat = status_info['status_category']
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
                    
                    # Create expandable tool card
                    with st.container():
                        col1, col2 = st.columns([4, 1])
                        with col1:
                            st.markdown(f"""
                            <div class="tool-card">
                                <h4>{icon} <span class="{css_class}">{tool}</span></h4>
                                <p><strong>Status:</strong> {status_info['status']}</p>
                                <p><strong>Issues:</strong> {status_info.get('issues', 'None')}</p>
                                <p><strong>Priority:</strong> {status_info.get('priority', '-')}</p>
                            </div>
                            """, unsafe_allow_html=True)
                        with col2:
                            if st.button(f"📖 Details", key=f"details_{tool}"):
                                show_tool_details(tool, status_info)

def show_tool_details(tool_name, status_info):
    """Show detailed information about a specific tool"""
    st.subheader(f"🔧 {tool_name}")
    
    # Basic info
    col1, col2 = st.columns(2)
    with col1:
        st.markdown(f"**Status:** {status_info['status']}")
        st.markdown(f"**Category:** {status_info['status_category'].title()}")
    with col2:
        st.markdown(f"**Issues:** {status_info.get('issues', 'None')}")
        st.markdown(f"**Priority:** {status_info.get('priority', 'Not set')}")
    
    # Detailed status if available
    if 'detailed_status' in status_info:
        st.markdown("**Detailed Status:**")
        st.info(status_info['detailed_status'])
    
    # Working components
    if 'working_components' in status_info and status_info['working_components']:
        st.markdown("**✅ Working Components:**")
        for component in status_info['working_components']:
            st.markdown(f"- {component}")
    
    # Current issues
    if 'current_issues' in status_info and status_info['current_issues']:
        st.markdown("**❌ Current Issues:**")
        for issue in status_info['current_issues']:
            st.markdown(f"- {issue}")
    
    # Technical details
    if 'technical_details' in status_info:
        st.markdown("**🔍 Technical Details:**")
        st.code(status_info['technical_details'])
    
    # Next steps
    if 'next_steps' in status_info and status_info['next_steps']:
        st.markdown("**🎯 Next Steps:**")
        for step in status_info['next_steps']:
            st.markdown(f"- {step}")

def show_testing_dashboard(flex_mode=False):
    if flex_mode:
        st.header("📊 RIGOROUS VALIDATION PROVES EXCELLENCE!")
        st.success("Every tested tool demonstrates production-ready quality and intelligent design!")
    else:
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
                tool_data['status'] = status_tool['status_category']
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

def show_key_learnings(flex_mode=False):
    if flex_mode:
        st.header("🧠 BREAKTHROUGH DISCOVERIES!")
        st.markdown("### 🎯 Every Challenge Conquered Led to Innovation")
    else:
        st.header("🧠 Key Learnings")
    
    learnings = [
        {
            "title": "🔐 OAuth2 Authentication Breakthrough",
            "description": "After extensive testing, discovered the correct OAuth2 implementation: Secondary API key = CLIENT_ID, Primary API key = CLIENT_SECRET. This breakthrough enabled production API access.",
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

def show_limitations(flex_mode=False):
    if flex_mode:
        st.header("🔧 OPPORTUNITIES FOR EVEN GREATER EXCELLENCE!")
        st.info("These 'limitations' are actually proof of our thorough testing and commitment to perfection!")
    else:
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

def show_work_to_do(flex_mode=False):
    if flex_mode:
        st.header("🚀 NEXT LEVEL ENHANCEMENTS!")
        st.markdown("### 🎯 Taking Perfection to New Heights")
    else:
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

def show_documentation_hub(flex_mode=False):
    if flex_mode:
        st.header("📚 COMPREHENSIVE DOCUMENTATION MASTERY!")
        st.markdown("### 🎯 Every Document Tells the Story of Excellence")
    else:
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