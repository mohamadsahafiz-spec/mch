import React, { useState, useRef } from 'react';
import { Settings as SettingsIcon, ShieldCheck, Database, RefreshCw, Bot, User, History, CheckCircle2, FileText, Info, Compass, AlertCircle, Cpu, Calendar, Tag, Activity, Bell, Save, Upload, Camera, Trash2, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useTheme } from '../../context/ThemeContext';
import { EngineerProfile } from '../../types';
import { UserAvatar } from '../common/UserAvatar';

interface SettingsProps {
  onResetData: () => void;
  profile?: EngineerProfile;
  onSaveProfile?: (profile: EngineerProfile) => void;
}

export const SettingsModule: React.FC<SettingsProps> = ({ onResetData, profile, onSaveProfile }) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [editProfile, setEditProfile] = useState<EngineerProfile>({
    name: profile?.name || 'Sahafiz',
    company: profile?.company || 'EO Technics',
    role: profile?.role || 'Field Service Engineer',
    department: profile?.department || 'Service Operations',
    avatarUrl: profile?.avatarUrl || ''
  });
  const [profileSaved, setProfileSaved] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError(null);
    if (!file) return;

    // Accepted formats check: JPG, JPEG, PNG, WEBP
    const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validFormats.includes(file.type.toLowerCase())) {
      setPhotoError('Invalid format. Accepted formats: JPG, JPEG, PNG, WEBP.');
      return;
    }

    // Maximum file size: 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('File size exceeds 5 MB limit. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditProfile(prev => ({ ...prev, avatarUrl: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setEditProfile(prev => ({ ...prev, avatarUrl: '' }));
    setPhotoError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveProfile) {
      onSaveProfile(editProfile);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }
  };

  const changelog = [
    {
      version: 'v0.7.4',
      date: '2026-08-03',
      type: 'Engineer Profile Photos & Identity System (ECO-20260802-028)',
      highlights: [
        'NEW: Individual Engineer Profile Photos for multi-engineer system readiness.',
        'NEW: Photo Upload, Change Photo, Remove Photo, and Restore Default Avatar controls in My Profile.',
        'NEW: Instant photo preview with 5MB file size validation and JPG/JPEG/PNG/WEBP format checks.',
        'NEW: Automatic system-wide photo propagation across Sidebar, Header Account Menu, Users Directory, Profile Drawer, Activity Log, and Report Studio.',
        'NEW: Clean Initials Avatar generator fallback (e.g. Sahafiz -> SA) ensuring zero broken image icons.',
        'NEW: Users Table now begins every engineer row with [Avatar] | Full Name | Role | Company | Department | Status.',
        'NEW: Report Studio includes engineer avatars beside Prepared By, Approved By, and Reviewed By signatures.',
        'NEW: Activity Log renders [Avatar] Sahafiz updated Machine Passport for high-fidelity accountability.',
        'FSOS RULE #001: Enforced CRUD consistency & version synchronization to v0.7.4 across all workspaces.'
      ]
    },
    {
      version: 'v0.7.3',
      date: '2026-08-03',
      type: 'Identity & User Management (ECO-20260802-027)',
      highlights: [
        'NEW: First-class "Users" module positioned in main sidebar above Settings for comprehensive team & identity governance.',
        'NEW: System Users directory table displaying Avatar, Full Name, Employee ID, Company, Department, Role, Status, and Last Login.',
        'NEW: Multi-Role hierarchy support with custom styled badges: Administrator, Field Service Engineer, Senior Engineer, Supervisor, Manager, and Viewer.',
        'NEW: Dynamic Real-time User Status tracking: Online, Offline, On Leave, Busy, and Inactive.',
        'NEW: Detailed User Profile drawer & editor with contact details, regional timezone/language settings, bio, and identity metadata.',
        'NEW: Top-right Header User Account menu with avatar, quick identity switch, notifications, appearance, and settings shortcuts.',
        'NEW: Multi-Engineer foundation enabling seamless active signed-in user switching with zero hardcoded engineer names remaining.',
        'SYSTEM HARMONIZATION: Version updated to v0.7.3 across Sidebar, Settings, About System, Release Notes, and Product Evolution Log.'
      ]
    },
    {
      version: 'v0.7.2',
      date: '2026-08-03',
      type: 'Founder Identity & Notification Center (ECO-20260802-026)',
      highlights: [
        'NEW: Founder Identity dynamic engineer profile greeting (e.g. "Good Morning, Sahafiz").',
        'NEW: Functional Notification Center bell with real-time operational notifications, unread badge counter, category tags, and click-to-navigate capabilities.',
        'NEW: Notification management controls including "Mark as Read", "Mark All as Read", and "Clear All".',
        'NEW: Configurable Engineer Profile source in System Settings allowing instant customization of Name, Company, Role, and Department.',
        'IMPROVED: Removed all remaining placeholder/demo engineer names ("Alex") across Machine Health Check, Execution Planner, Quality Investigation, Machine Passport, and Today\'s Activity Log.',
        'IMPROVED: Operational realism and user identity continuity across all FSOS workspaces.',
        'FIXED: Version and system build documentation synchronized to v0.7.2 across Sidebar, Settings, About System, and Report Studio.',
        'KNOWN ISSUES: Workflow Navigator UX refinement deferred to a future sprint.'
      ]
    },
    {
      version: 'v0.7.1',
      date: '2026-08-02',
      type: 'Daily Work Orchestration (ECO-20260802-025)',
      highlights: [
        'NEW: Daily Work operational entry point serving as the engineer\'s primary operational home upon opening FSOS.',
        'NEW: Mission orchestration providing unified visibility into customer (STMicroelectronics Muar), machine status (ASM Eagle XP-01), mission progress, and priority actions.',
        'NEW: Start Mission workflow for seamless execution initialization on new field service assignments.',
        'NEW: Continue Mission workflow enabling instant one-click resumption of active on-site work orders.',
        'NEW: Integrated Today\'s Schedule timeline and 3-day Upcoming Work outlook directly into the operational home page.',
        'NEW: Status KPI row tracking Machines Scheduled (2), Contract Days Remaining (68), Reports Pending (1), and Overdue Tasks (0).',
        'IMPROVED: Quick Access shortcuts providing direct 1-click navigation to Machine Passport, Workflow Guide, Planner, and Report Studio.',
        'IMPROVED: Navigation flow between existing modules, eliminating manual module searching and cognitive friction.'
      ]
    },
    {
      version: 'v0.7.0',
      date: '2026-08-02',
      type: 'Daily Work Operational Entry Point (ECO-20260802-025)',
      highlights: [
        'NEW: Daily Work operational entry point serving as the engineer\'s primary operational home upon opening FSOS.',
        'NEW: Mission orchestration providing unified visibility into customer, machine status, mission progress, and priority actions.',
        'NEW: Continue Mission workflow enabling instant one-click resumption of active on-site work orders.',
        'NEW: Start Mission workflow for seamless execution initialization on new field service assignments.',
        'IMPROVED: Navigation flow between existing modules (Dashboard, Machine Passport, Workflow Guide, Planner, Report Studio).',
        'IMPROVED: Engineer workflow continuity, eliminating manual module searching and cognitive friction.'
      ]
    },
    {
      version: 'v0.6.8',
      date: '2026-08-02',
      type: 'Mission Companion Floating Guide Rail Refactor (ECO-20260802-023B)',
      highlights: [
        'Floating Scroll-Sync Companion: Refactored Mission Companion container with responsive sticky positioning (`top-3 sm:top-4 z-20`) so the guide rail seamlessly floats along with the screen as engineers scroll down SOP steps.',
        'Elevated Backdrop Blur Styling: Enhanced Mission Companion container with backdrop blur filter, subtle shadow, and border rings so it visually floats alongside the SOP timeline content stream.',
        'Cross-Device Scroll Tracking: Ensured mobile, tablet, and desktop viewports all maintain active step scroll syncing and instant jump navigation.',
        'Cleanroom Operational Ergonomics: Optimized layout for single-column and two-column cleanroom tablet display ergonomics.',
        'System Version Harmonization: Synchronized v0.6.8 across Sidebar, Settings, About System, Report Studio, and Internal Changelog.'
      ]
    },
    {
      version: 'v0.6.7',
      date: '2026-08-02',
      type: 'Mission Companion Behaviour Fix (ECO-20260802-023A)',
      highlights: [
        'Founder Intent UX Alignment: Corrected Mission Companion behaviour to function as a quiet, ambient guide rail naturally embedded in the Workflow Guide.',
        'Zero Sidebar Chrome Perception: Removed heavy card borders and floating box aesthetics so engineers perceive guidance as part of the SOP document flow.',
        'Frameless Ambient Guide Rail: Blended step progress indicators and scroll tracking quietly into the page margin without intrusive visual popups or drawer chrome.',
        'Continuous Shift Ergonomics: Preserved smooth step jumping, active step scroll sync, and percentage progress indicators for 8-hour cleanroom shifts.',
        'System Version Harmonization: Synchronized v0.6.7 across Sidebar, Settings, About System, Report Studio, and Internal Changelog.'
      ]
    },
    {
      version: 'v0.6.6',
      date: '2026-08-02',
      type: 'Mission Companion Integration (ECO-20260802-023)',
      highlights: [
        'Product Vision Standard: Officially integrated Mission Companion as an ambient, quiet, and predictable guide rail within the Workflow Guide.',
        'Zero Visual Friction Execution: Removed explicit sidebar chrome perceptions, letting the Mission Companion visually blend directly into the SOP document flow.',
        'Continuous Shift Ergonomics: Designed for cleanroom Field Service Engineers operating for 8-hour shifts without cognitive overhead or manual scroll-backs.',
        'Real-time SOP Synchronization: Preserved precision scroll observer, instant step jumping, progress percentage tracking, and active step highlighting.',
        'PWA Cross-Platform Packaging: Strengthened Web App Manifest, standalone display mode, and icon support across Windows, macOS, Android, and iOS.'
      ]
    },
    {
      version: 'v0.6.5',
      date: '2026-08-01',
      type: 'Workflow Companion UX Alignment (ECO-20260801-022E)',
      highlights: [
        'Product Engineering UX Analysis: Formulated invisible, ambient Workflow Companion paradigm focusing on cleanroom operational ergonomic flow.',
        'Zero Visual Friction Principle: Shifted design criteria away from explicit "sticky sidebar" perception toward seamless ambient progress HUD.',
        'Continuous Operational Sync: Preserved real-time scroll observer, instant step jump, and step status tracking without intrusive UI chrome.',
        'PWA Foundation Enhancements: Enhanced web app manifest, stand-alone display tags, iOS web app capabilities, and cross-platform mobile icon paths.',
        'System Version Harmonization: Synchronized v0.6.5 across Sidebar, Settings, About System, Report Studio, and Internal Changelog.'
      ]
    },
    {
      version: 'v0.6.4',
      date: '2026-08-01',
      type: 'Workflow Navigator Behaviour Correction (ECO-20260801-022D)',
      highlights: [
        'Founder Intent UX Alignment: Configured Workflow Navigator as a persistent left-hand working companion (`sticky top-4`) during SOP scrolling.',
        'Zero-Scroll Jump Navigation: Guaranteed engineers always see Current Step, Completed Steps, Next Steps, and can jump instantly without scrolling back to top.',
        'Preserved SOP Aesthetics: Maintained clean 2-column SOP timeline flow without redesigning layout or creating unrequested secondary chromes.',
        'Automatic Step Observer: Real-time scroll detection keeps active step status, completion badges, and progress bar in continuous sync.',
        'Full PWA Foundation Established: Web App Manifest, standalone display mode, theme settings, and cross-platform mobile icons (Windows, macOS, Android, iOS).'
      ]
    },
    {
      version: 'v0.6.3',
      date: '2026-08-01',
      type: 'Unified Workflow Layout (ECO-20260801-022C)',
      highlights: [
        'Founder Layout Refactor: Completely eliminated the separate Workflow Navigator column, merging navigation and SOP into one continuous engineering document.',
        'Integrated Inline SOP Sequence Ribbon: Embedded quick-nav roadmap directly inside document flow, eliminating independent floating sidebar perception.',
        'Maximized Engineering Content Space: Removed left workspace column so SOP section cards expand naturally across full container width.',
        'Unified Scroll Architecture: Document content and embedded navigation scroll together naturally as a single operational manual.',
        'PWA Architecture Foundation: Established PWA manifest, theme colors, display standards, and mobile icon configurations.'
      ]
    },
    {
      version: 'v0.6.2',
      date: '2026-08-01',
      type: 'Workflow Navigator Follow Behaviour (ECO-20260801-022B)',
      highlights: [
        'Founder UX Correction: Configured Workflow Navigator to naturally follow the engineer while reading through long SOP sections.',
        'SOP Working Companion: Styled navigator as a document guide rail (`sticky top-4`) attached to the SOP timeline left margin.',
        'Eliminated Floating Sidebar Feeling: Preserved lightweight, calm document-rail visual identity without creating a secondary application chrome.',
        'Unbroken Navigation Access: Guaranteed engineers never need to scroll back to the top to jump between SOP phases.',
        'Maintained Real-Time Sync: Full support for active step scroll detection, step-jump smooth scrolling, and dark/light themes.'
      ]
    },
    {
      version: 'v0.6.1',
      date: '2026-08-01',
      type: 'Workflow Navigator Polish & Integration (ECO-20260801-022A)',
      highlights: [
        'Established FSOS Workflow Presentation Principle: Every workflow feels like one continuous operational document.',
        'Refined Workflow Navigator into a sleek, integrated SOP Guide Rail that attaches seamlessly to the timeline content stream.',
        'Eliminated duplicate navigation headers and redundant step labels to establish single-source visual clarity.',
        'Subordinated Navigator container styling with lighter footprints, left border indicator pills, and refined typography.',
        'Optimized desktop spatial grid spacing and responsive mobile guide rail alignment.',
        'Concluded Workflow Navigator milestone in full preparation for Daily Work Orchestration.'
      ]
    },
    {
      version: 'v0.6.0',
      date: '2026-08-01',
      type: 'Service Execution Foundation — SOP Navigation Enhancement (ECO-20260801-022)',
      highlights: [
        'Established FSOS Workflow Navigation Principle: Exists once, remains visible, reflects progress.',
        'Replaced top horizontal Mission Progression bar with persistent sticky vertical Workflow Navigator.',
        'Implemented automatic scroll-position synchronization with real-time active step detection.',
        'Added visual step indicators for completed (✓), active (►), and upcoming (○) SOP stages.',
        'Integrated smooth-scroll click jumping across all 6 SOP phases (Mission, Passport, MHC, Planner, Report, Complete).',
        'Extracted WorkflowNavigator as a reusable component for future execution modules (Calibration, Quality, Reports).'
      ]
    },
    {
      version: 'v0.5.3',
      date: '2026-07-31',
      type: 'Machine Passport Production Ready (ECO-20260731-021)',
      highlights: [
        'Declared Machine Passport feature-complete for Founder Release v0.5.3.',
        'Validated two-tier workspace interaction standard: Workspace Management vs Selected Object Management.',
        'Refined Customer & Machine Workspace card visual consistency, dashed creation tiles, and hover states.',
        'Verified zero modal clipping issues on Machine Hero Cockpit dropdowns across Light and Dark themes.',
        'Established Machine Passport as the gold-standard reference implementation for upcoming Service Execution and Report Studio milestones.'
      ]
    },
    {
      version: 'v0.5.2',
      date: '2026-07-31',
      type: 'Workspace Interaction Standardization (ECO-20260731-019)',
      highlights: [
        'Established FSOS permanent Workspace Interaction Principle: Creation is a Workspace Action, Management is an Object Action.',
        'Extracted "Add Machine" from Machine Actions dropdown and implemented dedicated "+ Add Machine" card tile in Machine Workspace grid.',
        'Maintained strict visual consistency between Customer Workspace cards and Machine Workspace cards (proportions, border-radius, hover transitions, dashed creation tiles).',
        'Enhanced Managed Laser Fleet header with rich customer account site, asset count, and operational availability status indicators.',
        'Kept Machine Actions dropdown strictly contextual to the selected machine (Edit, Rename, Duplicate, Archive, Delete).',
        'Updated version discipline across system sidebar, settings, report studio, and CTO notes.'
      ]
    },
    {
      version: 'v0.5.1',
      date: '2026-07-31',
      type: 'Customer Workspace Management (ECO-20260731-018)',
      highlights: [
        'Resolved MP-001 Machine Hero Cockpit dropdown menu clipping issue by eliminating parent overflow constraints.',
        'Completed full Customer CRUD suite (Add, Edit Details, Quick Rename, Delete Account) with persistent state.',
        'Integrated overflow dropdown menu (⋮) on all Layer 1 Customer Cards for inline account management.',
        'Added Add Customer card to Layer 1 grid for streamlined account creation.',
        'Enforced full version alignment to v0.5.1 across system sidebar, settings, and release notes.'
      ]
    },
    {
      version: 'v0.5.0',
      date: '2026-07-31',
      type: 'Customer Workspace Foundation (ECO-20260731-017)',
      highlights: [
        'Architected Layer 1 Customer Workspace with high-precision account cards displaying machine counts, average health, PM due, and critical alert badges.',
        'Architected Layer 2 Machine Workspace displaying filtered laser asset cards for the active customer account.',
        'Seamlessly bound Layer 3 Machine Hero Cockpit to selected machine cards for unified 3-tier navigation: Customer → Machine → Workspace.',
        'Preserved all existing CRUD features (Add, Edit, Rename, Duplicate, Archive, Delete) and 8-Point MHC execution workflows.',
        'Scaled navigation architecture for multi-customer, multi-site, and 100+ machine expansion.',
        'Updated system version discipline to v0.5.0 across all application modules.'
      ]
    },
    {
      version: 'v0.4.2',
      date: '2026-07-30',
      type: 'Machine Passport UX Enhancement (ECO-20260730-016)',
      highlights: [
        'Redesigned Machine Passport top section into a high-precision industrial hero cockpit.',
        'Created Fleet Navigator strip with Previous/Next machine controls and active status counts.',
        'Promoted selected machine to prominent Hero Card displaying core identity, health gauge, and location.',
        'Grouped all management functions (Add, Edit, Rename, Duplicate, Archive, Delete) into a sleek Machine Actions dropdown.',
        'Streamlined primary workflow actions (Execute 8-Point MHC, View Reports) for immediate engineer clarity.',
        'Maintained complete backward compatibility and system version discipline at v0.4.2.'
      ]
    },
    {
      version: 'v0.4.1',
      date: '2026-07-30',
      type: 'Machine Passport Management (ECO-20260730-015)',
      highlights: [
        'Integrated complete Machine Passport Management suite inside MachinePassportModule.',
        'Added Add Machine feature with complete telemetry baseline, laser heads, and consumable defaults.',
        'Added Edit Machine feature for updating machine specifications, customer allocations, and health scores.',
        'Added Rename Machine feature for fast inline re-designation of machine models and IDs.',
        'Added Delete Machine feature with confirmation dialog and automatic fleet re-selection.',
        'Positioned high-visibility management toolbar for <5-second discovery in Machine Passport.',
        'Updated system version discipline to v0.4.1 across sidebar, settings, and release notes.'
      ]
    },
    {
      version: 'v0.3.1',
      date: '2026-07-30',
      type: 'Theme Consistency (ECO-20260730-013)',
      highlights: [
        'Completed system-wide Light Theme compliance audit across all 15 operational modules.',
        'Standardized shared theme tokens across reusable UI primitives (Card, Button, Badge, Modal, Tables).',
        'Eliminated hardcoded theme color overrides to ensure automatic theme inheritance.',
        'Improved readability, font weights, and surface elevation contrast for bright site operations.',
        'Unified Dark Mode and Light Mode visual fidelity and component behavior.',
        'Engineering Metrics: 28 Files Reviewed, 14 Files Modified, 112 Hardcoded Theme Colors Converted, 0 Remaining Violations.'
      ]
    },
    {
      version: 'v0.3.0',
      date: '2026-07-30',
      type: 'Premium Light Experience (ECO-20260730-012)',
      highlights: [
        'Rebuilt Light Theme Design System for enhanced clarity, accessibility, and professional polish.',
        'Elevated text contrast hierarchy across headings, body text, and labels for comfortable reading.',
        'Improved surface elevation and border separation for clean card visibility across all system views.',
        'Refined sticky workflow navigation, badges, timeline connectors, and buttons for light mode operations.',
        'Enhanced sidebar readability with distinct section group titles and active item indicators.',
        'Dark theme token values strictly preserved and verified.'
      ]
    },
    {
      version: 'v0.2.9',
      date: '2026-07-30',
      type: 'Information Architecture (ECO-20260730-011)',
      highlights: [
        'Sidebar reorganized into workflow-based groups (DAILY WORK, SERVICE EXECUTION, OPERATIONS, SMART TOOLS, SYSTEM).',
        'Added collapsible navigation sections with auto-expansion for the active workflow tab.',
        'Reduced navigation complexity and cognitive load for field service engineers.',
        'Improved engineer workflow discovery following operational journey instead of flat/alphabetical lists.',
        'Preserved existing module functionality and routing architecture across all 15 system modules.'
      ]
    },
    {
      version: 'v0.2.8',
      date: '2026-07-30',
      type: 'Guided Navigation (ECO-20260730-010)',
      highlights: [
        'Added sticky Mission Progression navigation bar for effortless orientation during field operations.',
        'Added smooth scroll workflow navigation with stable section anchors (#mission, #passport, #mhc, #planner, #report, #complete).',
        'Active workflow step now tracks scrolling automatically via IntersectionObserver without layout flashing.',
        'Improved Workflow Guide usability for new field service engineers entering cleanroom sites.',
        'Existing workflow architecture, 6-phase SOP journey, and direct quick-action buttons preserved.'
      ]
    },
    {
      version: 'v0.2.7',
      date: '2026-07-30',
      type: 'Workflow Guide (ECO-20260730-009)',
      highlights: [
        'Introduced new Workflow Guide module providing 6-phase Standard Operating Procedure (SOP).',
        'Standardized step structure: Purpose, What To Do (max 4 bullets), Expected Outcome, Quick Action Buttons.',
        'Added visual progress indicator bar and end-of-workflow completion badge.'
      ]
    },
    {
      version: 'v0.2.5',
      date: '2026-07-30',
      type: 'Mission Control Signature Design (ECO-20260730-003)',
      highlights: [
        'Transformed Mission Control into an engineer\'s Operational Desk with signature visual identity.',
        'Implemented full pastel color language (#111315, #1A1D21, #20252B, #2B323A, #8B9DFF, #7FD4A6, #8ECDF7, #EFCB7A, #E98A8A).',
        'Implemented complete Theme Engine supporting Dark, Light, and System modes with smooth 250ms transitions.',
        'Refined Hero Section answering the 5 core operational questions in under 5 seconds.',
        'Added dedicated compact Machine Snapshot panel (Health, Heads, Cooling, Runtime, Remaining Service Life, SLA Progress).',
        'Reduced visual noise, softened borders, increased whitespace and mathematical typographic hierarchy.'
      ]
    },
    {
      version: 'v0.2.2',
      date: '2026-07-29',
      type: 'Mission Control Re-Architecture (ECO-20260729-004)',
      highlights: [
        "Re-architected Mission Control from a generic dashboard into a true operational workspace (like opening today's work order).",
        "Starts immediately with today's operation: Customer, Machine, Purpose, Inspection Stage, and Next Action.",
        "Split Mission Control into modular components: ActiveWorkOrderHeader, InspectionStageStepper, WorkOrderChecklist, OperationalPrerequisites, TodayActivityLog.",
        "Removed quick-action buttons grid and statistics charts from Mission Control in favor of sequence-based action flow.",
        "Embedded contextual AI guidance directly inside active inspection stages."
      ]
    },
    {
      version: 'v0.2.1',
      date: '2026-07-29',
      type: 'CTO Design Revision',
      highlights: [
        'Shifted interface to calm, quiet, industrial operations workspace for field engineers.',
        'Implemented intentional Light & Dark theme transition between dark operational workspace and bright customer documents.',
        'Redesigned Executive Reports & Knowledge Base into crisp, document-oriented light theme.',
        'Removed artificial stats blocks and glowing visual noise in favor of mission-first hierarchy.',
        'Enforced strict version discipline across all footers, settings, and documentation.'
      ]
    },
    {
      version: 'v0.2.0',
      date: '2026-07-15',
      type: 'Core System Expansion',
      highlights: [
        'Added 2-Year Execution Planner for long-term contract SLA maintenance scheduling.',
        'Integrated 8-Point Machine Health Check (MHC) automated score calculator.',
        'Added Laser Optics Beam Profiler & Galvo Scanner Calibration module.'
      ]
    },
    {
      version: 'v0.1.0',
      date: '2026-06-01',
      type: 'Initial Platform Release',
      highlights: [
        'Initial release of Field Service Operations System with Machine Passport & Contract Tracking.'
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Version Status Banner */}
      <Card title="System Version & Operational Build Status">
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border gap-4 ${
          isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border font-mono font-bold text-lg ${
              isDark ? 'bg-[#8B9DFF]/15 border-[#8B9DFF]/30 text-[#8B9DFF]' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>
              v0.7.3
            </div>
            <div>
              <h3 className="text-base font-bold">Field Service Operations System</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
                Identity & User Management v0.7.3 — Multi-Engineer Foundation (ECO-20260802-027)
              </p>
            </div>
          </div>
          <Badge variant="blue">v0.7.3 OPERATIONAL</Badge>
        </div>
      </Card>

      {/* About System Card */}
      <Card title="About System — Operational Specification">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className={`p-3.5 rounded-xl border space-y-1 ${
            isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Tag className="w-3.5 h-3.5 text-[#8B9DFF]" />
              <span className="font-mono uppercase text-[10px]">Version</span>
            </div>
            <p className="font-mono font-bold text-sm text-[#8B9DFF]">v0.7.3</p>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1 ${
            isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-[#8B9DFF]" />
              <span className="font-mono uppercase text-[10px]">Build ID</span>
            </div>
            <p className="font-mono font-bold text-sm">ECO-20260802-027</p>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1 ${
            isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Compass className="w-3.5 h-3.5 text-[#8B9DFF]" />
              <span className="font-mono uppercase text-[10px]">Release Codename</span>
            </div>
            <p className="font-semibold text-xs text-emerald-400">Daily Work Orchestration</p>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1 ${
            isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-[#8B9DFF]" />
              <span className="font-mono uppercase text-[10px]">Release Date</span>
            </div>
            <p className="font-mono text-xs">2026-08-02</p>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1 ${
            isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Activity className="w-3.5 h-3.5 text-[#8B9DFF]" />
              <span className="font-mono uppercase text-[10px]">Build Status</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="font-mono font-bold text-xs text-emerald-400">OPERATIONAL</p>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1 ${
            isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8B9DFF]" />
              <span className="font-mono uppercase text-[10px]">Target Deployment</span>
            </div>
            <p className="font-semibold text-xs">Cleanroom Field Ops (TRUMPF/ASML)</p>
          </div>
        </div>
      </Card>

      {/* CTO Strategic Directive & Product Evolution Log */}
      <Card title="CTO Directive & Product Evolution Log">
        <div className="space-y-4 text-xs">
          {/* CTO Note */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            isDark ? 'bg-[#8B9DFF]/10 border-[#8B9DFF]/30 text-slate-200' : 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-[#8B9DFF]">
                <Bot className="w-4 h-4" />
                <span>CTO STRATEGIC DIRECTIVE</span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#8B9DFF]/20 text-[#8B9DFF] border border-[#8B9DFF]/30 font-semibold">
                v0.7.1 MANDATE
              </span>
            </div>
            <p className="leading-relaxed">
              Daily Work is now the operational starting point of FSOS and marks the transition from separate modules to a guided workflow. Field Service Engineers no longer open FSOS as a collection of disconnected utilities; they enter through a single operational door that orchestrates their entire shift.
            </p>
          </div>

          {/* Product Evolution Log */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
              <History className="w-4 h-4 text-[#8B9DFF]" />
              <span>Product Evolution Log: The Genesis of Daily Work</span>
            </div>

            <div className="space-y-3 text-slate-300 dark:text-slate-300">
              <div className="space-y-1">
                <p className="font-semibold text-[#8B9DFF]">1. Why Daily Work Was Introduced</p>
                <p className="text-slate-400 leading-relaxed">
                  Historically, FSOS presented field engineers with a set of standalone modules (Dashboard, Machine Passport, Workflow Guide, Planner, Report Studio). While each module excelled in its specific domain, engineers were forced to manually decide where to click first, leading to cognitive friction, lost context during shift handovers, and unnecessary navigation steps.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-[#8B9DFF]">2. What Problem It Solves</p>
                <p className="text-slate-400 leading-relaxed">
                  Daily Work eliminates shift startup friction by immediately answering five core operational questions within 5 seconds: <i>Who am I visiting today? Which machine requires attention? What mission is assigned? Can I continue yesterday's work? What is my next action?</i>
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-[#8B9DFF]">3. How It Changes the Engineer's Daily Workflow</p>
                <p className="text-slate-400 leading-relaxed">
                  Daily Work transforms FSOS from a passive database into a proactive operational guide. The engineer opens FSOS, reviews today's pre-populated mission status, and clicks a single primary call-to-action (<b>"Start Today's Mission"</b> or <b>"Continue Mission"</b>) to launch directly into active execution with zero manual setup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Release Notes Summary */}
      <Card title="Release Notes — v0.7.1 Daily Work Orchestration">
        <div className={`p-4 rounded-xl border space-y-3 text-xs ${
          isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between border-b border-[#2B323A]/60 pb-2">
            <span className="font-bold text-sm text-[#8B9DFF]">Release Summary (Sprint ECO-20260802-025)</span>
            <span className="font-mono text-slate-400">Target: v0.7.1</span>
          </div>

          <p className="text-slate-300 leading-relaxed">
            Sprint v0.7.0 delivers Daily Work Orchestration, unifying all existing FSOS capabilities into an engineer-first operational journey. Rather than functioning as isolated tools, Dashboard, Machine Passport, Workflow Guide, Planner, and Report Studio are now interconnected through Daily Work as the central operational home.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#111315] border-[#2B323A]/80' : 'bg-white border-slate-200'}`}>
              <p className="font-bold text-[#7FD4A6] mb-1">✓ Primary Action Clarity</p>
              <p className="text-slate-400 text-[11px]">One clear primary button ("Continue Mission" or "Start Mission") guides engineers without decision paralysis.</p>
            </div>
            <div className={`p-3 rounded-lg border ${isDark ? 'bg-[#111315] border-[#2B323A]/80' : 'bg-white border-slate-200'}`}>
              <p className="font-bold text-[#8ECDF7] mb-1">✓ Seamless Module Routing</p>
              <p className="text-slate-400 text-[11px]">Direct contextual routing into Workflow Guide, Machine Passport, and Execution Planner with zero lost state.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Structured Changelog */}
      <Card title="Internal Architecture Milestone Changelog">
        <div className="space-y-4">
          {changelog.map((entry) => (
            <div key={entry.version} className={`p-4 rounded-xl border text-xs space-y-2 ${
              isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b border-[#2B323A]/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#8B9DFF]">{entry.version}</span>
                  <span className="font-semibold">{entry.type}</span>
                </div>
                <span className="font-mono text-slate-400">{entry.date}</span>
              </div>
              <ul className="space-y-1 pl-4 list-disc text-slate-400">
                {entry.highlights.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Engineer Profile & Reset */}
      <Card title="Engineer Profile & System Data Management">
        <div className="space-y-6 text-xs">
          {/* Active Profile Card & Editor */}
          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-[#2B323A]/60 mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  isDark ? 'bg-[#8B9DFF]/10 border-[#8B9DFF]/30 text-[#8B9DFF]' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-100 dark:text-white">
                      {profile?.name || editProfile.name || 'Engineer'}
                    </h4>
                    <Badge variant="emerald">ACTIVE ON-SITE</Badge>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    {profile?.role || editProfile.role} • {profile?.company || editProfile.company} ({profile?.department || editProfile.department})
                  </p>
                </div>
              </div>

              {profileSaved && (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Profile Updated
                </span>
              )}
            </div>

            {/* Profile Photo Experience (Sprint ECO-20260802-028) */}
            <div className={`p-4 rounded-xl border mb-5 ${
              isDark ? 'bg-[#111315] border-[#2B323A]' : 'bg-white border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <UserAvatar
                    user={editProfile}
                    size="xl"
                    showStatus={true}
                    status="Online"
                  />
                  <div>
                    <h5 className="font-bold text-sm text-slate-100 dark:text-white flex items-center gap-2">
                      Profile Photo
                      {editProfile.avatarUrl && (
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Custom Photo Active
                        </span>
                      )}
                    </h5>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Accepted formats: <strong className="text-slate-300">JPG, JPEG, PNG, WEBP</strong> (Max <strong className="text-slate-300">5 MB</strong>). Instant preview before saving.
                    </p>
                    {photoError && (
                      <p className="text-rose-400 text-[11px] font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {photoError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  {!editProfile.avatarUrl ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      icon={<Upload className="w-3.5 h-3.5" />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload Photo
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        icon={<Camera className="w-3.5 h-3.5" />}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change Photo
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        icon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
                        onClick={handleRemovePhoto}
                        title="Restore Default Initials Avatar"
                      >
                        Restore Default
                      </Button>

                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        icon={<Trash2 className="w-3.5 h-3.5" />}
                        onClick={handleRemovePhoto}
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Edit Form */}
            <form onSubmit={handleSaveProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-slate-300">
                    Engineer Name
                  </label>
                  <input
                    type="text"
                    value={editProfile.name}
                    onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                    placeholder="e.g. Sahafiz"
                    className={`w-full px-3 py-1.5 rounded-lg border text-xs font-medium ${
                      isDark 
                        ? 'bg-[#111315] border-[#2B323A] text-slate-200 focus:border-[#8B9DFF]' 
                        : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-slate-300">
                    Company
                  </label>
                  <input
                    type="text"
                    value={editProfile.company}
                    onChange={(e) => setEditProfile({ ...editProfile, company: e.target.value })}
                    placeholder="e.g. EO Technics"
                    className={`w-full px-3 py-1.5 rounded-lg border text-xs font-medium ${
                      isDark 
                        ? 'bg-[#111315] border-[#2B323A] text-slate-200 focus:border-[#8B9DFF]' 
                        : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-slate-300">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={editProfile.role}
                    onChange={(e) => setEditProfile({ ...editProfile, role: e.target.value })}
                    placeholder="e.g. Field Service Engineer"
                    className={`w-full px-3 py-1.5 rounded-lg border text-xs font-medium ${
                      isDark 
                        ? 'bg-[#111315] border-[#2B323A] text-slate-200 focus:border-[#8B9DFF]' 
                        : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold mb-1 text-slate-300">
                    Department
                  </label>
                  <input
                    type="text"
                    value={editProfile.department}
                    onChange={(e) => setEditProfile({ ...editProfile, department: e.target.value })}
                    placeholder="e.g. Service Operations"
                    className={`w-full px-3 py-1.5 rounded-lg border text-xs font-medium ${
                      isDark 
                        ? 'bg-[#111315] border-[#2B323A] text-slate-200 focus:border-[#8B9DFF]' 
                        : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={<Save className="w-3.5 h-3.5" />}
                >
                  Save Profile Settings
                </Button>
              </div>
            </form>
          </div>

          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isDark ? 'bg-[#1A1D21] border-[#2B323A]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <p className="font-bold text-sm text-[#E98A8A]">Reset Local Workspace State</p>
              <p className="text-slate-400">Restores default contracts, machines, schedule, tasks, and MHC audit records.</p>
            </div>
            <Button variant="danger" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onResetData}>
              Reset State
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
