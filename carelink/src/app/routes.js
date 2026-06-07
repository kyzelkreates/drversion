// 4P3X Route definitions — RUN 1 through RUN 9
// CareLink Extension
import { CareLink }           from '../pages/CareLink.jsx';
import { CareSignalLanding }  from '../pages/CareSignalLanding.jsx';

import { Dashboard }               from '../pages/Dashboard.jsx';
import { Modules }                 from '../pages/Modules.jsx';
import { VariantProfile }          from '../pages/VariantProfile.jsx';
import { AiConfig }                from '../pages/AiConfig.jsx';
import { Settings }                from '../pages/Settings.jsx';
import { BlueprintEngine }         from '../pages/BlueprintEngine.jsx';
import { BlueprintDetail }         from '../pages/BlueprintDetail.jsx';
import { TransformationReadiness } from '../pages/TransformationReadiness.jsx';
import { AiAgents }                from '../pages/AiAgents.jsx';
import { AgentWorkbench }          from '../pages/AgentWorkbench.jsx';
import { AgentRecommendations }    from '../pages/AgentRecommendations.jsx';
import { NotFound }                from '../pages/NotFound.jsx';

// Run 4 — default exports
import _TransformationCompiler    from '../pages/TransformationCompiler.jsx';
import _ProductSkeletonGenerator  from '../pages/ProductSkeletonGenerator.jsx';
import _TransformationPlanDetail  from '../pages/TransformationPlanDetail.jsx';
export const TransformationCompiler   = _TransformationCompiler;
export const ProductSkeletonGenerator = _ProductSkeletonGenerator;
export const TransformationPlanDetail = _TransformationPlanDetail;

// Run 5
import { VariantBuildLauncher }   from '../pages/VariantBuildLauncher.jsx';
import { RunPromptGenerator }     from '../pages/RunPromptGenerator.jsx';
import { GeneratedPromptDetail }  from '../pages/GeneratedPromptDetail.jsx';

// Run 6
import { VariantWorkspaces }      from '../pages/VariantWorkspaces.jsx';
import { WorkspaceDetail }        from '../pages/WorkspaceDetail.jsx';
import { WorkspaceComparison }    from '../pages/WorkspaceComparison.jsx';

// Run 7
import { ExportCentre }           from '../pages/ExportCentre.jsx';
import { HandoffPackBuilder }     from '../pages/HandoffPackBuilder.jsx';
import { DeploymentReadiness }    from '../pages/DeploymentReadiness.jsx';
import { ExportPackDetail }       from '../pages/ExportPackDetail.jsx';
// Run 8
import { FinalSystemAudit }         from '../pages/FinalSystemAudit.jsx';
import { ProductionHardening }      from '../pages/ProductionHardening.jsx';
import { TransformationReadinessLock } from '../pages/TransformationReadinessLock.jsx';
import { FinalReadinessReport }     from '../pages/FinalReadinessReport.jsx';
import BasePackageBuilder from '../pages/BasePackageBuilder.jsx';
import PackageManifest     from '../pages/PackageManifest.jsx';
import PackageValidation   from '../pages/PackageValidation.jsx';
import MasterVariantLauncher            from '../pages/MasterVariantLauncher.jsx';
import VariantTransformationPromptBuilder from '../pages/VariantTransformationPromptBuilder.jsx';
import FinalBaseCompletion                from '../pages/FinalBaseCompletion.jsx';


export const routes = [
  { path: '/',         component: CareSignalLanding, label: 'CareSignal OS', icon: 'home' },
  { path: '/carelink', component: CareLink,           label: 'CareSignal OS',  icon: 'shield' },

  // Run 1
  { path: '/modules',         component: Modules },
  { path: '/variant-profile', component: VariantProfile },
  { path: '/ai-config',       component: AiConfig },
  { path: '/settings',        component: Settings },
  // Run 2
  { path: '/blueprints',        component: BlueprintEngine },
  { path: '/blueprint-detail',  component: BlueprintDetail },
  { path: '/readiness',         component: TransformationReadiness },
  // Run 3
  { path: '/ai-agents',             component: AiAgents },
  { path: '/agent-workbench',       component: AgentWorkbench },
  { path: '/agent-recommendations', component: AgentRecommendations },
  // Run 4
  { path: '/transformation-compiler',    component: TransformationCompiler },
  { path: '/product-skeleton-generator', component: ProductSkeletonGenerator },
  { path: '/transformation-plan-detail', component: TransformationPlanDetail },
  // Run 5
  { path: '/variant-build-launcher',  component: VariantBuildLauncher },
  { path: '/run-prompt-generator',    component: RunPromptGenerator },
  { path: '/generated-prompt-detail', component: GeneratedPromptDetail },
  // Run 6
  { path: '/variant-workspaces',   component: VariantWorkspaces },
  { path: '/workspace-detail',     component: WorkspaceDetail },
  { path: '/workspace-comparison', component: WorkspaceComparison },
  // Run 7
  { path: '/export-centre',       component: ExportCentre },
  { path: '/handoff-pack-builder', component: HandoffPackBuilder },
  { path: '/deployment-readiness', component: DeploymentReadiness },
  { path: '/export-pack-detail',   component: ExportPackDetail },
  // Run 8
  { path: '/final-system-audit',          component: FinalSystemAudit },
  { path: '/production-hardening',        component: ProductionHardening },
  { path: '/transformation-readiness-lock', component: TransformationReadinessLock },
  { path: '/final-readiness-report',      component: FinalReadinessReport },
  // Run 9
  { path: '/base-package-builder', component: BasePackageBuilder },
  { path: '/package-manifest',     component: PackageManifest },
  { path: '/package-validation',   component: PackageValidation },
  // Run 10
  { path: '/master-variant-launcher',             component: MasterVariantLauncher },
  { path: '/variant-transformation-prompt-builder', component: VariantTransformationPromptBuilder },
  { path: '/final-base-completion',               component: FinalBaseCompletion },
];

export { NotFound };
