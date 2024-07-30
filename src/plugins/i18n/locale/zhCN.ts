// message roles
// 1: item 3 depth 미만 default 항상 포함
// 2: item 3 depth 이상시 필요시 또는 항목 이 여러개일때는 default 추가
// 3: item name 은 snake case 사용하여 표현(_)
const messages = {
    plugins: {
        datepicker: {
            format: 'YYYY-MM-DD',
            format_dt: 'YYYY-MM-DD HH:mm:ss',
            format_dt_bs: 'YYYY-MM-DD HH:mm:ss' // backend server 에 값 넘길때 형식
        },
        chart: {
            labels: {
                months: [
                    '一月',
                    '二月',
                    '三月',
                    '四月',
                    '五月',
                    '六月',
                    '七月',
                    '八月',
                    '九月',
                    '十月',
                    '十一月',
                    '十二月'
                ],
                months_short: [
                    '一月',
                    '二月',
                    '三月',
                    '四月',
                    '五月',
                    '六月',
                    '七月',
                    '八月',
                    '九月',
                    '十月',
                    '十一月',
                    '十二月'
                ]
            },
            backgroundColor: {
                certificate: ['#b3cad8'],
                system: ['#c3dceb', '#a2786f', '#628d53']
            },
            pie_chart: {},
            line_chart: {
                cert_req: {
                    labels: [
                        '一月',
                        '二月',
                        '三月',
                        '四月',
                        '五月',
                        '六月',
                        '七月',
                        '八月',
                        '九月',
                        '十月',
                        '十一月',
                        '十二月'
                    ],
                    backgroundColor: ['#00D8FF', '#41B883', '#e5ff00', '#ec3110', '#5b23dd', '#ab31e4']
                }
            }
        }
    },
    btn: {
        default: '按钮',
        account: {
            default: '帐户',
            my: {
                default: '我的账户'
            }
        },
        add: {
            default: '添加',
            field: {
                default: '添加字段'
            }
        },
        cancel: {
            default: '消除'
        },
        clear: {
            default: 'Clear',
            all: {
                default: 'ClearAll'
            }
        },
        close: {
            default: '关闭'
        },
        confirm: {
            default: '查看'
        },
        create: {
            default: '生产'
        },
        delete: {
            default: '删除'
        },
        download: {
            default: '下载'
        },
        excel: {
            default: 'Excel',
            download: {
                default: 'Excel下载'
            },
            upload: {
                default: 'Excel上传'
            }
        },
        execute: {
            default: '执行'
        },
        file: {
            default: '文件',
            select: {
                default: '选择文件'
            }
        },
        import: {
            default: 'Import'
        },
        key: {
            default: '钥匙',
            add: {
                default: '添加密钥'
            },
            create: {
                default: '创建密钥'
            },
            delete: {
                default: '删除键'
            }
        },
        list: {
            default: '列表'
        },
        login: {
            default: '登录'
        },
        logout: {
            default: '登出'
        },
        password: {
            default: '密码',
            change: {
                default: '更改密码'
            },
            reset: {
                default: '重设密码'
            }
        },
        registration: {
            default: '登记'
        },
        reset: {
            default: '重置',
            field: {
                default: '字段初始化'
            }
        },
        run: {
            default: '执行'
        },
        save: {
            default: '节省',
            as: {
                default: 'SaveAs',
                add: {
                    default: 'SaveAs & Add'
                }
            }
        },
        search: {
            default: '搜索'
        },
        signature: {
            default: '签名',
            run: {
                default: '符号'
            }
        },
        upload: {
            default: '上传'
        },
        user: {
            default: '用户',
            registration: {
                default: '用户注册'
            }
        },
        verify: {
            default: '确认',
            run: {
                default: '核实'
            }
        }
    },
    msg: {
        default: '信息',
        confirm: {
            default: '您想确认一下吗？',
            create: {
                default: '你想创建它吗？',
                name: {
                    default: 'Would you like to create with name?',
                    args: {
                        default: 'Would you like to create a new {0} named "{1}"?'
                    }
                }
            },
            delete: {
                default: '你确定你要删除？'
            },
            emergency: {
                default: '您想检查应急计划的状态吗？',
                change: {
                    default: '您想更改您的紧急状态吗？',
                    go: {
                        default: '您想继续采取紧急行动吗？'
                    },
                    stop: {
                        default: '您想暂停紧急状态吗？'
                    }
                }
            },
            execute: {
                default: '你想运行它吗？'
            },
            expire: {
                default: '您想检查有效期吗？',
                auth: {
                    default: '您的认证将过期。 您想确认一下吗？',
                    argv: {
                        time: {
                            default: '身份验证将在 {0} 秒后过期。 您想续订吗？'
                        }
                    }
                }
            },
            file: {
                default: '您想检查一下文件吗？',
                upload: {
                    default: '您想上传文件吗？'
                },
                download: {
                    default: '您想下载该文件吗？'
                }
            },
            login: {
                default: '你想登录吗？',
                argv: {
                    duplicate: {
                        default: 'IP [{0}] 的用户已登录。 您想阻止正在使用它的用户吗？'
                    }
                }
            },
            sign: {
                default: '您愿意签名吗？',
                request: {
                    default: '您想请求签名吗？'
                }
            },
            read: {
                default: '您想查看吗？'
            },
            registration: {
                default: '您想注册吗？'
            },
            reset: {
                default: '您想重置吗？',
                fields: {
                    default: '您想初始化设置的字段吗？'
                }
            },
            run: {
                default: '你想运行它吗？'
            },
            update: {
                default: '您想续订吗？'
            }
        },
        error: {
            default: '错误',
            fail: {
                default: 'Failed.',
                create: {
                    default: 'Failed to create.',
                    args: {
                        default: 'Failed to create a {0}.'
                    }
                }
            },
            info: {
                default: '发生了错误。',
                data: {
                    default: '发生与数据相关的错误。',
                    not_exist: {
                        default: '该数据不存在。'
                    }
                },
                email: {
                    default: '发生与电子邮件相关的错误。',
                    confirm: {
                        default: '请检查您的电子邮件地址。'
                    }
                },
                file: {
                    default: '发生与文件相关的错误。',
                    check: {
                        default: '请检查文件。'
                    },
                    download: {
                        default: '下载文件时发生错误。'
                    },
                    extension: {
                        default: '发生与文件扩展名相关的错误。',
                        check: {
                            default: '请检查文件扩展名。'
                        }
                    },
                    not_exist: {
                        default: '该文件不存在。',
                        argv: {
                            default: '文件 [{0}] 不存在。'
                        }
                    },
                    upload: {
                        default: '上传文件时发生错误。',
                        size: {
                            default: '由于文件上传大小而发生错误。',
                            limit: {
                                default: '已超出文件上传限制。',
                                argv: {
                                    default: '只能注册小于 {0}MB 的文件。',
                                    base: {
                                        default: '只能注册小于 {0}MB 的文件。 \n\n当前文件大小：{1}MB'
                                    }
                                }
                            }
                        }
                    }
                },
                key_group: {
                    default: '发生与密钥组相关的错误。',
                    not_exist: {
                        default: '密钥组不存在。',
                        argv: {
                            default: '密钥组 [{0}] 不存在。',
                            create: {
                                default: '密钥组 [{0}] 不存在。 自动生成。'
                            }
                        }
                    }
                },
                login: {
                    default: '登录失败。',
                    account: {
                        default: '请检查您的帐户。',
                        info: {
                            default: '请检查您的帐户信息。'
                        },
                        lock: {
                            default: '您的帐户已被锁定。'
                        },
                        argv: {
                            default: '请检查您的帐户。 还剩 {0} 直到锁定。'
                        }
                    },
                    limit: {
                        default: '登录受到限制。',
                        argv: {
                            default: '登录超时：直到 {0}'
                        }
                    }
                },
                request: {
                    default: '您的请求失败。',
                    sign: {
                        default: '签名请求失败。'
                    },
                    verify: {
                        default: '验证请求失败。'
                    }
                },
                run: {
                    default: '执行失败。'
                },
                unauthorized: {
                    default: '身份验证正在进行中或身份验证已过期。'
                },
                user: {
                    default: '这是用户信息。',
                    already: {
                        default: '这是已经注册的用户信息。'
                    }
                },
                verify: {
                    default: '验证过程中发生错误。'
                }
            },
            invalid: {
                default: 'It is invalid.',
                format: {
                    default: 'It is invalid format.',
                    arg: {
                        default: '{0} is invalid {1} format.'
                    },
                    gid: {
                        default: 'It is invalid gid format.',
                        arg: {
                            default: '{0} is invalid gid format. It should be number.'
                        }
                    },
                    ip: {
                        default: 'It is invalid IP format.',
                        arg: {
                            default: '{0} is invalid IP format.'
                        }
                    },
                    msg: {
                        default: 'It is invalid msg format.',
                        arg: {
                            default: '{0} is invalid msg format.'
                        }
                    },
                    port: {
                        default: 'It is invalid Port format.',
                        arg: {
                            default: '{0} is invalid Port format.'
                        }
                    },
                    rev: {
                        default: 'It is invalid rev format.',
                        arg: {
                            default: '{0} is invalid rev format. It should be number.'
                        }
                    },
                    sid: {
                        default: 'It is invalid sid format.',
                        arg: {
                            default: '{0} is invalid sid format. It should be number.'
                        }
                    }
                }
            },
            create: {
                default: '创建过程中发生错误。',
                registration: {
                    default: '注册期间发生错误。'
                }
            },
            read: {
                default: '查询期间发生错误。'
            },
            update: {
                default: '更新期间发生错误。'
            },
            delete: {
                default: '删除时发生错误。',
                not_allow: {
                    default: 'Not allowed to delete.',
                    in_use: {
                        default: 'Not allowed to delete it while it is currently in use.',
                        args: {
                            default: 'Not allowed to delete a {0} that is currently in use.'
                        }
                    }
                }
            },
            no_input: {
                default: '没有输入任何值。',
                blueprint: {
                    default: '没有选择蓝图。',
                    profile: {
                        default: '没有选择蓝图配置文件。',
                        first: {
                            default: '请先选择一个蓝图配置文件。'
                        }
                    }
                },
                contents: {
                    default: '请输入您的详细信息。'
                },
                enter: {
                    ip: {
                        defafult: 'There is no IP value entered.'
                    },
                    port: {
                        defafult: 'There is no Port value entered.'
                    }
                },
                select: {
                    default: '没有选择任何值。',
                    blueprint: {
                        default: 'Th没有选择蓝图。',
                        preset: {
                            default: '没有选择预设。',
                            field_name: {
                                default: '没有选择任何字段。',
                                first: {
                                    default: '请先选择字段名称。'
                                }
                            }
                        },
                        profile: {
                            default: '没有选择蓝图配置文件。',
                            first: {
                                default: '请先选择一个蓝图配置文件。'
                            }
                        }
                    },
                    date: {
                        default: '没有选择日期。'
                    },
                    file: {
                        defafult: '没有选择任何文件。',
                        drag: {
                            default: '选择一个文件或将其拖至此处。'
                        }
                    },
                    ip: {
                        defafult: 'There is no IP selected.'
                    },
                    port: {
                        defafult: 'There is no Port selected.'
                    }
                }
            },
            no_match: {
                default: '输入的值不匹配。',
                password: {
                    default: '您输入的密码不匹配。'
                }
            },
            required: {
                default: 'It is required.',
                args: {
                    default: '{0} is required field.'
                }
            },
            wrong_input: {
                default: '请检查您的输入值。',
                not_allowed: {
                    default: '无法输入无效值。',
                    delete: {
                        argv: {
                            auto: {
                                default: '不允许的值 ({0}) 已自动删除。'
                            }
                        }
                    }
                },
                duplicate: {
                    default: '不能输入重复的数据。',
                    args: {
                        default: '{0} can not be duplicated.'
                    }
                },
                item: {
                    default: '请检查该项目的输入值。',
                    argv: {
                        default: '请检查{0}项的输入值。'
                    }
                },
                max: {
                    default: '大于最大值。',
                    argv: {
                        default: '大于最大值{0}。 请再次输入。',
                        input: {
                            default: '输入值 {0} 大于最大值 {1}。 请再次输入。',
                            length: {
                                default: '输入 {0} 大于最大长度 {1}。 请再次输入。'
                            }
                        }
                    }
                },
                min: {
                    default: '小于最小值。',
                    argv: {
                        default: '小于最小值{0}。 请再次输入。',
                        input: {
                            default: '输入值 {0} 小于最小值 {1}。 请再次输入。',
                            length: {
                                default: '输入 {0} 小于最小长度 {1}。 请再次输入。'
                            }
                        }
                    }
                },
                password: {
                    default: '请检查您输入的密码。',
                    rule: {
                        default:
                            '请检查您输入的密码！ \n\n规则：\n至少8个字符，\n至少1个大小写混合字母，\n至少1个数字，\n至少1个特殊符号！！！'
                    }
                }
            }
        },
        info: {
            add: {
                default: '已添加。',
                field: {
                    default: '输入已添加。',
                    no_more: {
                        default: '没有更多字段可添加。'
                    }
                }
            },
            apply: {
                default: '已应用。'
            },
            change: {
                default: '它已经改变了。',
                profile: {
                    default: '您已更改您的个人资料。',
                    first_click: {
                        default: '要更改您的个人资料，请先单击。',
                        reset_field_btn: {
                            default: '要更改您的个人资料，请首先单击“重置字段”按钮。'
                        }
                    }
                }
            },
            create: {
                default: 'It has been created.',
                successfully: {
                    default: 'It has been successfully created.',
                    args: {
                        default: '{0} has been successfully created.'
                    }
                }
            },
            delete: {
                default: '它已被删除。'
            },
            execute: {
                default: '它已经被执行了。',
                api: {
                    default: '它已经被执行了。',
                    sign_retrieve: {
                        default: '已执行签名文件下载请求。'
                    },
                    product_certificate_chain: {
                        default: '已执行产品证书链下载请求。'
                    }
                }
            },
            emergency: {
                default: '这是紧急状态。',
                not_allow: {
                    default: '在紧急情况下不能这样做。',
                    args: {
                        default: '紧急响应模式下无法执行{0}。'
                    }
                }
            },
            file: {
                default: '这是一个文件。',
                select: {
                    default: '请选择一个文件。'
                },
                download: {
                    default: '文件已下载。'
                }
            },
            group_name: {
                default: '组名已定义。',
                exist: {
                    default: '该组名称已存在。',
                    no_use: {
                        default: '由于组名已存在，因此无法使用。',
                        argv: {
                            default: '{0} 是已存在的组名称，因此无法使用。'
                        }
                    }
                }
            },
            input: {
                default: '请输入。',
                preset: {
                    default: '请输入预设。',
                    desc: {
                        default: '请输入预设的描述。'
                    },
                    title: {
                        default: '请输入预设标题。'
                    },
                    value: {
                        default: '请输入预设字段。',
                        at_least_one: {
                            default: '请输入至少一个预设字段。'
                        },
                        not_empty: {
                            default: '请输入一个空的预设字段。'
                        }
                    }
                }
            },
            key: {
                default: '请检查您的钥匙。',
                type: {
                    default: '请检查密钥类型。',
                    select: {
                        default: '请选择密钥类型。'
                    }
                }
            },
            network: {
                default: '网络正在使用中。',
                error: {
                    default: '网络故障。',
                    args: {
                        default: '无法在网络故障状态下执行{0}。',
                        kms: {
                            default: '无法在 KMS 网络故障状态下执行 {0}。'
                        }
                    }
                },
                success: {
                    default: '网络处理正常。',
                    emergency: {
                        default: '网络正常情况下无法启动紧急响应模式。'
                    }
                }
            },
            no_data: {
                default: 'There is no data.',
                ip: {
                    default: 'There is no ip data.'
                }
            },
            preset: {
                default: '请检查预设。',
                title: {
                    exist: {
                        default: '该标题已经存在。',
                        no_use: {
                            default: '该标题已存在且无法使用。',
                            argv: {
                                default: '{0} 是已存在的标题，因此无法使用。'
                            }
                        }
                    }
                }
            },
            registration: {
                default: '您已被注册。',
                user: {
                    default: '用户已注册。',
                    id: {
                        default: '挂号的。 \n请检查您使用用户 ID 注册的电子邮件。'
                    }
                }
            },
            run: {
                default: '它已经被执行了。'
            },
            save: {
                default: '它已被保存。'
            },
            select: {
                default: '请选择。',
                preset: {
                    default: '请选择一个预设。',
                    profile: {
                        default: '请选择预设配置文件。'
                    }
                }
            },
            sign: {
                default: '它已经签署了。',
                options: {
                    default: '签名选项。',
                    select: {
                        default: '请选择签名选项。',
                        auto_complete: {
                            default:
                                '请选择一个签名项。如果您选择它，它将自动创建。（例如[文件名]_[YYYYMMDD]_SIG_[密钥名称]_[uuid]）'
                        }
                    }
                }
            },
            update: {
                default: 'It has been updated.',
                args: {
                    default: '{0} has been updated.'
                }
            },
            verify: {
                default: '已经验证了。',
                options: {
                    default: '验证选项。',
                    select: {
                        default: '请选择一个验证选项。',
                        auto_complete: {
                            default:
                                '请选择一个验证项。如果您选择它，它将自动创建。（例如[文件名]_[YYYYMMDD]_VER_[密钥名称]_[uuid])'
                        }
                    }
                }
            }
        }
    },
    voca: {
        default: '单词',
        access: {
            default: '连接',
            time: {
                default: '访问日期'
            }
        },
        account: {
            default: '帐户',
            details: {
                default: '帐户详细资料'
            },
            registration: {
                default: '账户注册'
            }
        },
        action: {
            default: 'Action'
        },
        admin: {
            default: '管理人',
            id: {
                default: '管理人ID'
            },
            name: {
                default: '管理人姓名'
            }
        },
        all: {
            default: '全部的'
        },
        any: {
            default: 'Any',
            ips: {
                default: 'Any IPs'
            },
            ports: {
                default: 'Any Ports'
            }
        },
        apply: {
            default: '申请',
            N: {
                default: '未应用'
            },
            Y: {
                default: '申请'
            }
        },
        auth: {
            default: '权威',
            description: {
                default: '权限说明'
            },
            details: {
                default: '权限详情'
            },
            id: {
                default: '权限ID'
            },
            name: {
                default: '机关名称'
            }
        },
        basic: {
            default: 'Basic',
            options: {
                default: 'Basic Options'
            }
        },
        blueprint: {
            default: 'Blueprint',
            code: {
                default: 'Blueprint 代码',
                description: {
                    default: 'Blueprint 代码说明'
                },
                detail: {
                    default: 'Blueprint 代码详细信息'
                },
                name: {
                    default: 'Blueprint 代码名称'
                },
                string_length: {
                    default: '字段长度'
                }
            },
            group: {
                default: 'Blueprint 团体',
                code: {
                    default: 'Blueprint 集团代码',
                    description: {
                        default: 'Blueprint 组码 说明'
                    },
                    detail: {
                        default: 'Blueprint 集团代码详细信息'
                    },
                    name: {
                        default: 'Blueprint 组代码名称'
                    },
                    type: {
                        default: 'Blueprint 组码类型'
                    }
                }
            },
            preset: {
                default: 'Blueprint Preset',
                description: {
                    default: 'Blueprint Preset 描述'
                },
                detail: {
                    default: 'Blueprint Preset 细节'
                },
                profile: {
                    default: 'Blueprint 轮廓'
                },
                title: {
                    default: 'Preset 标题'
                }
            }
        },
        build: {
            default: 'Build',
            id: {
                default: 'Build ID'
            }
        },
        change: {
            default: '改变',
            time: {
                default: '改变时间'
            }
        },
        classification: {
            default: '分类'
        },
        client: {
            default: '客户',
            hash: {
                default: '客户端哈希'
            }
        },
        code: {
            default: '代码',
            description: {
                default: '详细代码说明'
            },
            details: {
                default: '代码详情'
            },
            item: {
                default: '项目',
                1: {
                    default: '项目 1'
                },
                2: {
                    default: '项目 2'
                },
                3: {
                    default: '项目 3'
                },
                4: {
                    default: '项目 4'
                },
                5: {
                    default: '项目 5'
                }
            },
            name: {
                default: '代码名称'
            }
        },
        company: {
            default: '公司',
            autocrypt: {
                default: 'Autocrypt',
                url: 'https://www.autocrypt.io',
                script: {
                    default: 'AUTOCRYPT Mobility Intelligence'
                }
            }
        },
        component: {
            default: 'Component',
            id: {
                default: 'Component ID'
            }
        },
        confirm: {
            default: '肯定'
        },
        connection: {
            ip: {
                default: '连接IP'
            },
            status: {
                default: '连接状态'
            }
        },
        content: {
            default: 'content',
            modifier: {
                default: 'content-modifier'
            }
        },
        contents: {
            default: '内容'
        },
        copyright: {
            default: '版权',
            owner: {
                default: '版权所有。'
            }
        },
        count: {
            default: '数数',
            argv: {
                default: '病例数：{0}例'
            }
        },
        create: {
            default: '生产',
            count: {
                default: '创作数量'
            },
            id: {
                default: '构造函数'
            },
            time: {
                default: '创建日期'
            }
        },
        data: {
            default: '数据',
            change: {
                default: '改变数据',
                details: {
                    default: '数据变更详情'
                },
                previous_later: {
                    default: '变更前/变更后的数据'
                },
                previous: {
                    default: '变更前数据'
                },
                later: {
                    default: '变更后的数据'
                }
            },
            tampered: {
                default: '数据篡改'
            }
        },
        delete: {
            default: '删除'
        },
        description: {
            default: 'Description'
        },
        destination: {
            default: 'Dst',
            ip: {
                default: 'Dst IP'
            },
            port: {
                default: 'Dst port'
            }
        },
        details: {
            default: '细节'
        },
        detection: {
            default: 'Detection',
            filter: {
                default: 'detection_filter'
            }
        },
        depth: {
            default: 'depth'
        },
        direction: {
            default: 'Direction'
        },
        distance: {
            default: 'distance',
            within: {
                default: 'distance, within'
            }
        },
        download: {
            default: '下载'
        },
        duplicate: {
            default: '重复',
            login: {
                default: '重复登录',
                confirm: {
                    default: '检查是否有重复登录'
                }
            }
        },
        ecu: {
            default: 'ECU',
            id: {
                default: 'ECU ID'
            }
        },
        email: {
            default: '电子邮件'
        },
        emergency: {
            default: '紧急情况',
            status: {
                default: '紧急状态'
            }
        },
        encrypt: {
            default: '加密'
        },
        error: {
            default: '错误'
        },
        event: {
            create: {
                default: '活动创建',
                id: {
                    default: '事件触发'
                }
            },
            msg: {
                default: '事件消息',
                details: {
                    default: '事件消息详细屏幕'
                }
            },
            type: {
                default: '赛事分类'
            }
        },
        excel: {
            default: 'Excel'
        },
        execute: {
            default: '执行',
            time: {
                default: '执行时间处理时间',
                last: {
                    default: '最后执行时间'
                }
            }
        },
        fast_pattern: {
            default: 'fast_pattern'
        },
        file: {
            default: '文件',
            cert: {
                default: '证书文件',
                chain: {
                    default: '证书链文件'
                }
            },
            name: {
                default: '文件名'
            },
            request: {
                default: '请求文件'
            },
            sign: {
                default: '签名文件'
            },
            unsigned: {
                default: '未签名文件'
            },
            upload: {
                default: '上传文件',
                sign: {
                    default: '上传文件进行签名'
                },
                verify: {
                    default: '上传文件进行验证'
                }
            }
        },
        gid: {
            default: 'gid'
        },
        group: {
            default: '团体',
            code: {
                default: '集团代码',
                description: {
                    default: '集团代码详细信息'
                },
                details: {
                    default: '集团代码详细信息'
                },
                name: {
                    default: '团体代号'
                }
            }
        },
        header: {
            default: 'Header'
        },
        home: {
            default: 'Home'
        },
        id: {
            default: 'ID',
            save: {
                default: '保存ID'
            }
        },
        information: {
            default: '信息'
        },
        init_vector: {
            default: '初始向量'
        },
        ip: {
            default: 'IP',
            add: {
                default: 'Add IP'
            },
            types: {
                default: 'IP Types'
            }
        },
        key: {
            default: '钥匙',
            add: {
                default: '添加密钥'
            },
            delete: {
                default: '删除键'
            },
            group: {
                default: '关键群体',
                details: {
                    default: '关键组详细信息'
                },
                name: {
                    default: '关键组名称'
                },
                record: {
                    default: '关键群体历史',
                    details: {
                        default: '关键组历史详细信息'
                    }
                }
            },
            name: {
                default: '键名'
            },
            type: {
                default: '关键方法'
            }
        },
        language: {
            default: '语言',
            support: {
                list: {
                    default: ['韓國語', '英語', '中國語']
                }
            },
            kr: {
                default: '韓國語'
            },
            us: {
                default: '英語'
            },
            cn: {
                default: '中國語'
            }
        },
        log: {
            default: '日志',
            category: {
                default: '日志类型'
            },
            details: {
                default: '日志详情'
            }
        },
        menu: {
            default: '菜单',
            description: {
                default: '菜单说明'
            },
            details: {
                default: '菜单详情'
            },
            id: {
                default: '菜单ID',
                1: {
                    default: '菜单ID1'
                },
                2: {
                    default: '菜单ID2'
                },
                3: {
                    default: '菜单ID3'
                },
                4: {
                    default: '菜单ID4'
                },
                5: {
                    default: '菜单ID5'
                }
            },
            name: {
                default: '菜单名称'
            },
            url: {
                default: '菜单网址'
            }
        },
        msg: {
            default: '信息',
            error: {
                default: '错误信息'
            },
            acronym: {
                default: 'msg'
            }
        },
        name: {
            default: '姓名',
            system: {
                default: '系统名称',
                pg: {
                    default: 'AutoCrypt Policy Generator'
                }
            }
        },
        negation: {
            default: 'negation'
        },
        network: {
            default: '网络'
        },
        non_payload: {
            default: 'Non-Payload'
        },
        notice: {
            default: '通知',
            reason: {
                default: '通知（理由）'
            }
        },
        offset: {
            default: 'offset',
            depth: {
                default: 'offset, depth'
            }
        },
        otp: {
            default: 'OTP',
            auth: {
                default: '一次性密码认证'
            },
            device: {
                default: '一次性密码设备',
                registration: {
                    default: 'OTP 设备注册'
                }
            },
            input: {
                default: '输入一次性密码'
            }
        },
        page: {
            default: '页',
            argv: {
                default: '{0}',
                entire: {
                    default: '{2}（共 {0} 至 {1}）'
                }
            },
            per: {
                default: '每页',
                data: {
                    default: '每页数据'
                }
            }
        },
        password: {
            default: '密码',
            confirm: {
                default: '验证密码'
            },
            current: {
                default: '当前密码'
            },
            new: {
                default: '新密码',
                confirm: {
                    default: '确认新密码'
                }
            },
            reset: {
                default: '重设密码'
            }
        },
        payload: {
            default: 'Payload'
        },
        pcre: {
            default: 'pcre'
        },
        port: {
            default: 'Port',
            add: {
                default: 'Add Port'
            },
            types: {
                default: 'Port Types'
            }
        },
        post_detection: {
            default: 'Post Detection'
        },
        protocol: {
            default: 'Protocol'
        },
        product: {
            default: '产品',
            id: {
                default: '产品编号'
            }
        },
        project: {
            default: '项目',
            id: {
                default: '项目编号'
            }
        },
        public: {
            default: '民众',
            key: {
                default: '公钥'
            }
        },
        qr: {
            default: '二维码',
            scan: {
                default: '二维码扫描',
                auth: {
                    default: '身份验证二维码扫描',
                    method: {
                        default: '二维码扫描注册认证方式'
                    }
                },
                device: {
                    default: '二维码扫描用于设备注册'
                }
            }
        },
        read: {
            default: '读'
        },
        reason: {
            default: '原因'
        },
        region: {
            default: '地区'
        },
        request: {
            default: '要求',
            file: {
                default: '请求文件'
            }
        },
        result: {
            default: '结果',
            file: {
                default: '结果文件'
            }
        },
        rev: {
            default: 'rev'
        },
        rule: {
            default: 'Rule',
            detail: {
                default: 'Rule Detail'
            },
            new: {
                default: 'New Rule'
            },
            plural: {
                default: 'Rules'
            }
        },
        ruleset: {
            default: 'Ruleset'
        },
        run: {
            default: '执行',
            time: {
                default: '执行时间处理时间',
                last: {
                    default: '上次运行时间'
                }
            }
        },
        search: {
            default: '搜索',
            condition: {
                default: '搜寻条件'
            }
        },
        seconds: {
            default: 'seconds'
        },
        service: {
            default: '服务',
            type: {
                default: '服务类别'
            }
        },
        sid: {
            default: 'sid'
        },
        signature: {
            default: '签名',
            auto: {
                default: '自动签名处理',
                verify: {
                    default: '签名时自动验证'
                }
            },
            error: {
                default: '签名错误'
            },
            info: {
                default: '签名信息',
                same: {
                    default: '与签名信息相同'
                }
            },
            not_exist: {
                default: '没有签名'
            },
            request: {
                default: '签署请求',
                details: {
                    default: '签署请求详细信息'
                }
            },
            run: {
                default: '符号'
            }
        },
        sort: {
            default: '种类',
            order: {
                default: '排序'
            }
        },
        source: {
            default: 'Src',
            ip: {
                default: 'Src IP'
            },
            port: {
                default: 'Src port'
            }
        },
        status: {
            default: '情况'
        },
        success: {
            default: '成功'
        },
        symmetric: {
            default: '对称',
            key: {
                default: '对称密钥'
            }
        },
        synchronous: {
            default: '同步',
            request: {
                default: '同步请求',
                y: {
                    default: '响应包含签名数据'
                },
                n: {
                    default: '响应不包含签名数据'
                }
            }
        },
        table: {
            default: '数据库表',
            name: {
                default: '数据库表名'
            }
        },
        time: {
            default: '小时'
        },
        title: {
            default: '标题'
        },
        track: {
            default: 'track'
        },
        type: {
            default: '类别'
        },
        update: {
            default: '更正'
        },
        upper: {
            default: '不同之处',
            menu: {
                default: '顶部菜单 ID'
            }
        },
        use: {
            yn: {
                default: '是否使用'
            },
            y: {
                default: '使用'
            },
            n: {
                default: '没用过'
            },
            time: {
                default: '使用日期'
            }
        },
        user: {
            add: {
                default: '添加用户'
            },
            define: {
                default: '风俗'
            },
            details: {
                default: '用户详细信息'
            },
            id: {
                default: '用户身份'
            },
            name: {
                default: '用户名'
            }
        },
        verify: {
            default: '确认',
            fail: {
                default: '验证失败'
            },
            run: {
                default: '核实'
            },
            status: {
                default: '验证状态'
            },
            success: {
                default: '验证完成'
            }
        },
        version: {
            default: '版本',
            argv: {
                default: 'Ver. {0}'
            }
        },
        within: {
            default: 'within'
        }
    }
};

export default messages;
