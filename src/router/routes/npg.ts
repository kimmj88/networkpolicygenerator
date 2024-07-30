// file kl.ts

// KL Component
const requiresAuthFlag = true;

const network_policy_generator = [
    {
        path: '/npg/variable/list',
        name: 'ValiableList',
        meta: { requiresAuth: requiresAuthFlag },
        component: () => import('@/views/npg/variable/VariableView.vue')
    },
    {
        path: '/npg/rule/rule/list',
        name: 'RuleList',
        meta: { requiresAuth: requiresAuthFlag },
        component: () => import('@/views/npg/rule/RuleView.vue')
    },
    {
        path: '/npg/rule/rule/detail',
        name: 'RuleDetail',
        meta: { requiresAuth: requiresAuthFlag },
        component: () => import('@/views/npg/rule/RuleDetailView.vue')
    },
    {
        path: '/npg/rule/ruleset/list',
        name: 'RulesetList',
        meta: { requiresAuth: requiresAuthFlag },
        component: () => import('@/views/npg/rule/RulesetView.vue')
    },
    {
        path: '/npg/rule/ruleset/detail',
        name: 'RulesetDetail',
        meta: { requiresAuth: requiresAuthFlag },
        component: () => import('@/views/npg/rule/RulesetDetailView.vue')
    },
    {
        path: '/npg/module/list',
        name: 'ModuleList',
        meta: { requiresAuth: requiresAuthFlag },
        component: () => import('@/views/npg/module/ModuleView.vue')
    },
    {
        path: '/npg/policy/list',
        name: 'PolicyList',
        meta: { requiresAuth: requiresAuthFlag },
        component: () => import('@/views/npg/policy/PolicyView.vue')
    }
] as any;

// const routes_target = function getComponent(arg: any) {
const routes_npg = () => {
    return [...network_policy_generator];
};

export default routes_npg;
