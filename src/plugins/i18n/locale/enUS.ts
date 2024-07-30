// message roles
// 1: item 3 depth 미만 default 항상 포함
// 2: item 3 depth 이상시 필요시 또는 항목이 여러개일때는 default 추가

// 3: item name 은 snake case 사용하여 표현(_)
const messages = {
    plugins: {
        datepicker: {
            format: 'MM/DD/YYYY',
            format_dt: 'MM/DD/YYYY HH:mm:ss',
            format_dt_bs: 'YYYY-MM-DD HH:mm:ss' // backend server 에 값 넘길때 형식
        },
        chart: {
            labels: {
                months: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ],
                months_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            backgroundColor: {
                certificate: ['#b3cad8'],
                system: ['#c3dceb', '#a2786f', '#628d53']
            },
            pie_chart: {},
            line_chart: {
                cert_req: {
                    labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December'
                    ],
                    backgroundColor: ['#00D8FF', '#41B883', '#e5ff00', '#ec3110', '#5b23dd', '#ab31e4']
                }
            }
        }
    },
    btn: {
        default: 'Button',
        account: {
            default: 'Account',
            my: {
                default: 'My Account'
            }
        },
        add: {
            default: 'Add',
            field: {
                default: 'Add Field'
            }
        },
        cancel: {
            default: 'Cancle'
        },
        clear: {
            default: 'Clear',
            all: {
                default: 'ClearAll'
            }
        },
        close: {
            default: 'Close'
        },
        confirm: {
            default: 'Confirm'
        },
        create: {
            default: 'Create'
        },
        delete: {
            default: 'Delete'
        },
        download: {
            default: 'Download'
        },
        excel: {
            default: 'Excel',
            download: {
                default: 'Download Excel'
            },
            upload: {
                default: 'Upload Excel'
            }
        },
        execute: {
            default: 'Execute'
        },
        export: {
            default: 'Export'
        },
        file: {
            default: 'File',
            select: {
                default: 'Select File'
            }
        },
        import: {
            default: 'Import'
        },
        key: {
            default: 'Key',
            add: {
                default: 'Add Key'
            },
            create: {
                default: 'Create Key'
            },
            delete: {
                default: 'Delete Key'
            }
        },
        list: {
            default: 'List'
        },
        login: {
            default: 'Login'
        },
        logout: {
            default: 'Logout'
        },
        password: {
            default: 'Password',
            change: {
                default: 'Change Password'
            },
            reset: {
                default: 'Reset Password'
            }
        },
        registration: {
            default: 'Registration'
        },
        reset: {
            default: 'reset',
            field: {
                default: 'Reset fields'
            }
        },
        run: {
            default: 'Run'
        },
        save: {
            default: 'Save',
            as: {
                default: 'SaveAs',
                add: {
                    default: 'SaveAs & Add'
                }
            }
        },
        search: {
            default: 'Search'
        },
        signature: {
            default: 'Signature',
            run: {
                default: 'Sign'
            }
        },
        upload: {
            default: 'Upload'
        },
        user: {
            default: 'User',
            registration: {
                default: 'Register User'
            }
        },
        verify: {
            default: 'Verification',
            run: {
                default: 'Verify'
            }
        }
    },
    msg: {
        default: 'Message',
        confirm: {
            default: 'Would you like to confirm',
            create: {
                default: 'Would you like to create?',
                name: {
                    default: 'Would you like to create with name?',
                    args: {
                        default: 'Would you like to create a new {0} \n\nnamed "{1}"?'
                    }
                }
            },
            delete: {
                default: 'Would you like to delete?'
            },
            emergency: {
                default: 'Would you like to check the status of emergency preparedness?',
                change: {
                    default: 'Would you like to change your emergency preparedness status?',
                    go: {
                        default: 'Would you like to proceed with the emergency preparedness status?'
                    },
                    stop: {
                        default: 'Would you like to suspend the emergency preparedness status?'
                    }
                }
            },
            execute: {
                default: 'Do you want to run it?'
            },
            expire: {
                default: 'Do you want to check expiration?',
                auth: {
                    default: 'Your session will expire. Would you like to confirm?',
                    argv: {
                        time: {
                            default: 'Your session will expire within {0} seconds. Would you like to renew?'
                        }
                    }
                }
            },
            file: {
                default: 'Would you like to check the file?',
                upload: {
                    default: 'Would you like to upload a file?'
                },
                download: {
                    default: 'Would you like to download the file?'
                }
            },
            login: {
                default: 'Would you like to log in?',
                argv: {
                    duplicate: {
                        default: 'A user from IP [{0}] is logged in. Do you want to stop the user who is using it?'
                    }
                }
            },
            sign: {
                default: 'Would you like to sign?',
                request: {
                    default: 'Would you like to request a signature?'
                }
            },
            read: {
                default: 'Would you like to view it?'
            },
            registration: {
                default: 'Would you like to register?'
            },
            reset: {
                default: 'Do you want to reset?',
                fields: {
                    default: 'Would you like to initialize the set fields?'
                }
            },
            run: {
                default: 'Do you want to run it?'
            },
            update: {
                default: 'Would you like to update?'
            }
        },
        error: {
            default: 'Error',
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
                default: 'An error has occurred.',
                data: {
                    default: 'A data-related error occurred.',
                    not_exist: {
                        default: 'The data does not exist.'
                    }
                },
                email: {
                    default: 'An email-related error occurred.',
                    confirm: {
                        default: 'Please check your email address.'
                    }
                },
                export: {
                    default: 'Failed to export file.'
                },
                file: {
                    default: 'A file-related error occurred.',
                    check: {
                        default: 'Please check the file.'
                    },
                    download: {
                        default: 'An error occurred when downloading the file.'
                    },
                    extension: {
                        default: 'An error related to the file extension occurred.',
                        check: {
                            default: 'Please check the file extension.'
                        }
                    },
                    not_exist: {
                        default: 'The file does not exist.',
                        argv: {
                            default: 'File [{0}] does not exist.'
                        }
                    },
                    upload: {
                        default: 'An error occurred when uploading the file.',
                        size: {
                            default: 'An error occurred due to the file upload size.',
                            limit: {
                                default: 'The file upload limit has been exceeded.',
                                argv: {
                                    default: 'Only files smaller than {0}MB can be registered.',
                                    base: {
                                        default:
                                            'Only files smaller than {0}MB can be registered. \n\nCurrent file size: {1}MB'
                                    }
                                }
                            }
                        }
                    }
                },
                key_group: {
                    default: 'An error related to Key Group occurred.',
                    not_exist: {
                        default: 'Key Group does not exist.',
                        argv: {
                            default: 'Key Group [{0}] does not exist.',
                            create: {
                                default: 'Key Group [{0}] does not exist. Automatically generated.'
                            }
                        }
                    }
                },
                module: {
                    default: 'An error related to Module occurred.',
                    not_exist: {
                        default: 'Module does not exist.',
                        option: {
                            default: 'Some module options not exist.'
                        }
                    }
                },
                login: {
                    default: 'Login failed.',
                    account: {
                        default: 'Please check your account.',
                        info: {
                            default: 'Please check your account information.'
                        },
                        lock: {
                            default: 'Your account is locked.'
                        },
                        argv: {
                            default: 'Please check your account. {0} left until locked.'
                        }
                    },
                    limit: {
                        default: 'Login is restricted.',
                        argv: {
                            default: 'Login timeout: until {0}'
                        }
                    }
                },
                request: {
                    default: 'Your request failed.',
                    sign: {
                        default: 'Sign request failed.'
                    },
                    verify: {
                        default: 'Verification request failed.'
                    }
                },
                run: {
                    default: 'Execution failed.'
                },
                unauthorized: {
                    default: 'Authentication is in progress or authentication has expired.'
                },
                user: {
                    default: 'This is user information.',
                    already: {
                        default: 'This is already registered user information.'
                    }
                },
                verify: {
                    default: 'An error occurred during verification.'
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
                default: 'An error occurred during creation.',
                registration: {
                    default: 'An error occurred during registration.'
                }
            },
            read: {
                default: 'An error occurred during inquiry.'
            },
            update: {
                default: 'An error occurred during update.'
            },
            delete: {
                default: 'An error occurred when deleting.',
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
                default: 'There is no value entered.',
                contents: {
                    default: 'Please enter your details.'
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
                    default: 'There are no values selected.',
                    blueprint: {
                        default: 'There is no Blueprint selected.',
                        preset: {
                            default: 'There is no Preset selected.',
                            field_name: {
                                default: 'There is no field selected.',
                                first: {
                                    default: 'Please select the field name first.'
                                }
                            }
                        },
                        profile: {
                            default: 'There is no Blueprint Profile selected.',
                            first: {
                                default: 'Please select a Blueprint profile first.'
                            }
                        }
                    },
                    date: {
                        default: 'There are no dates selected.'
                    },
                    file: {
                        defafult: 'There are no files selected.',
                        drag: {
                            default: 'Choose a file or drag it here.'
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
                default: 'The entered values do not match.',
                password: {
                    default: 'The password you entered does not match.'
                }
            },
            required: {
                default: 'It is required.',
                args: {
                    default: '{0} is required field.'
                }
            },
            wrong_input: {
                default: 'Please check your input values.',
                not_allowed: {
                    default: 'Invalid values cannot be entered.',
                    delete: {
                        argv: {
                            auto: {
                                default: 'Unallowed values ({0}) were automatically deleted.'
                            }
                        }
                    }
                },
                duplicate: {
                    default: 'Duplicate data cannot be entered.',
                    args: {
                        default: '{0} can not be duplicated.'
                    }
                },
                item: {
                    default: 'Please check the input value of the item.',
                    argv: {
                        default: 'Please check the input value of {0} item.'
                    }
                },
                max: {
                    default: 'greater than the maximum.',
                    argv: {
                        default: 'Greater than the maximum value {0}. Please enter again.',
                        input: {
                            default: 'The input value {0} is greater than the maximum value {1}. Please enter again.',
                            length: {
                                default: 'Input {0} is greater than the maximum length {1}. Please enter again.'
                            }
                        }
                    }
                },
                min: {
                    default: 'Less than the minimum value.',
                    argv: {
                        default: 'Less than the minimum value {0}. Please enter again.',
                        input: {
                            default: 'The input value {0} is less than minimum value {1}. Please enter again.',
                            length: {
                                default: 'Input {0} is less than minimum length {1}. Please enter again.'
                            }
                        }
                    }
                },
                password: {
                    default: 'Please check the password you entered.',
                    rule: {
                        default:
                            'Please check the password you entered! \n\nRules: \nAt least 8 characters, \nAt least 1 mixed case/lowercase letter, \nAt least 1 number, \nAt least 1 special symbol!'
                    }
                }
            }
        },
        info: {
            add: {
                default: 'It has been added.',
                field: {
                    default: 'input has been added.',
                    no_more: {
                        default: 'There are no more fields to add.'
                    }
                }
            },
            apply: {
                default: 'It has been applied.'
            },
            change: {
                default: 'It has been changed.',
                profile: {
                    default: 'You have changed your profile.',
                    first_click: {
                        default: 'To change your profile, please click first.',
                        reset_field_btn: {
                            default: 'To change your profile, first click the Reset Fields button.'
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
                default: 'It has been deleted.'
            },
            execute: {
                default: 'It has been executed.',
                api: {
                    default: 'It has been executed.',
                    sign_retrieve: {
                        default: 'A signed file download request was executed.'
                    },
                    product_certificate_chain: {
                        default: 'A product certificate chain download request was executed.'
                    }
                }
            },
            export: {
                default: 'It has been exported.'
            },
            emergency: {
                default: 'This is a state of emergency.',
                not_allow: {
                    default: 'This cannot be done in an emergency situation.',
                    args: {
                        default: '{0} cannot be performed in emergency state.'
                    }
                }
            },
            file: {
                default: "It's a file.",
                select: {
                    default: 'Please select a file.'
                },
                download: {
                    default: 'The file has been downloaded.'
                }
            },
            group_name: {
                default: 'The group name has been defined.',
                exist: {
                    default: 'This group name already exists.',
                    no_use: {
                        default: 'Since the group name already exists, it cannot be used.',
                        argv: {
                            default: '{0} is a group name that already exists, so it cannot be used.'
                        }
                    }
                }
            },
            input: {
                default: 'Please enter.',
                preset: {
                    default: 'Please enter Preset.',
                    desc: {
                        default: 'Please enter a description of the preset.'
                    },
                    title: {
                        default: 'Please enter the Preset title.'
                    },
                    value: {
                        default: 'Please enter Preset Field.',
                        at_least_one: {
                            default: 'Please enter at least one Preset Field.'
                        },
                        not_empty: {
                            default: 'Please enter an empty Preset Field.'
                        }
                    }
                }
            },
            key: {
                default: 'Please check your key.',
                type: {
                    default: 'Please check the key type.',
                    select: {
                        default: 'Please select a key type.'
                    }
                }
            },
            value: {
                default: 'Please check your value.',
                type: {
                    default: 'Please check the value type.',
                    select: {
                        default: 'Please select a value type.'
                    }
                }
            },
            network: {
                default: 'The network is in use.',
                error: {
                    default: 'Network failure.',
                    args: {
                        default: '{0} cannot be performed in a network failure state.',
                        kms: {
                            default: '{0} cannot be performed in a KMS network failure state.'
                        }
                    }
                },
                success: {
                    default: 'The network is healthy.',
                    emergency: {
                        default: 'Emergency response mode cannot be activated in normal network conditions.'
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
                default: 'Please check the preset.',
                title: {
                    exist: {
                        default: 'This Title already exists.',
                        no_use: {
                            default: 'This title already exists and cannot be used.',
                            argv: {
                                default: '{0} is a Title that already exists, so it cannot be used.'
                            }
                        }
                    }
                }
            },
            registration: {
                default: 'Registered.',
                user: {
                    default: 'User has been registered.',
                    id: {
                        default: 'Registered. \nPlease check the email you registered with your user ID.'
                    }
                }
            },
            run: {
                default: 'It has been executed.'
            },
            save: {
                default: 'It has been saved.'
            },
            select: {
                default: 'Please select.',
                preset: {
                    default: 'Please select a Preset.',
                    profile: {
                        default: 'Please select a Preset profile.'
                    }
                }
            },
            sign: {
                default: 'It has been Signed.',
                options: {
                    default: 'This is Signature Options.',
                    select: {
                        default: 'Please Select Signature items.',
                        auto_complete: {
                            default:
                                'Please select a signature item. If you select it, it will be automatically created. (e.g. [file name]_[YYYYMMDD]_SIG_[key name]_[uuid])'
                        }
                    }
                }
            },
            type: {
                default: 'It has been Typed.',
                select: {
                    default: 'Please Select Type.'
                }
            },
            update: {
                default: 'It has been updated.',
                args: {
                    default: '{0} has been updated.'
                }
            },
            verify: {
                default: 'It has been verified.',
                options: {
                    default: 'This is Verification Options.',
                    select: {
                        default: 'Please Select Verification Options.',
                        auto_complete: {
                            default:
                                'Please select a verification item. If you select it, it will be automatically created. (e.g. [file name]_[YYYYMMDD]_VER_[key name]_[uuid])'
                        }
                    }
                }
            }
        }
    },
    voca: {
        default: 'Word',
        access: {
            default: 'Access',
            time: {
                default: 'Access date'
            }
        },
        account: {
            default: 'Account',
            details: {
                default: 'Account Detail'
            },
            registration: {
                default: 'Account registration'
            }
        },
        action: {
            default: 'Action'
        },
        admin: {
            default: 'Admin',
            id: {
                default: 'Admin Id'
            },
            name: {
                default: 'Admin Name'
            }
        },
        all: {
            default: 'All'
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
            default: 'Apply',
            N: {
                default: 'Unapplied'
            },
            Y: {
                default: 'Apply'
            }
        },
        auth: {
            default: 'Authority',
            description: {
                default: 'Permission description'
            },
            details: {
                default: 'Permission details'
            },
            id: {
                default: 'Authority ID'
            },
            name: {
                default: 'Authority Name'
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
                default: 'Blueprint Code',
                description: {
                    default: 'Blueprint Code Description'
                },
                detail: {
                    default: 'Blueprint Code Detail'
                },
                name: {
                    default: 'Blueprint Codename'
                },
                string_length: {
                    default: 'Field Length'
                }
            },
            group: {
                default: 'Blueprint Group',
                code: {
                    default: 'Blueprint GroupCode',
                    description: {
                        default: 'Blueprint GroupCode Description'
                    },
                    detail: {
                        default: 'Blueprint GroupCode Detail'
                    },
                    name: {
                        default: 'Blueprint GroupCodeName'
                    },
                    type: {
                        default: 'Blueprint GroupCode Type'
                    }
                }
            },
            preset: {
                default: 'Blueprint Preset',
                description: {
                    default: 'Blueprint Preset Description'
                },
                detail: {
                    default: 'Blueprint Preset Detail'
                },
                profile: {
                    default: 'Blueprint Profile'
                },
                title: {
                    default: 'Preset Title'
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
            default: 'Change',
            time: {
                default: 'Change Time'
            }
        },
        classification: {
            default: 'Classification'
        },
        client: {
            default: 'Client',
            hash: {
                default: 'Client Hash'
            }
        },
        code: {
            default: 'Code',
            description: {
                default: 'Detailed code description'
            },
            details: {
                default: 'Code Details'
            },
            item: {
                default: 'Item',
                1: {
                    default: 'Item1'
                },
                2: {
                    default: 'Item2'
                },
                3: {
                    default: 'Item3'
                },
                4: {
                    default: 'Item4'
                },
                5: {
                    default: 'Item5'
                }
            },
            name: {
                default: 'Code name'
            }
        },
        company: {
            default: 'Company',
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
            default: 'Confirm'
        },
        connection: {
            ip: {
                default: 'Connection IP'
            },
            status: {
                default: 'Connection status'
            }
        },
        content: {
            default: 'content',
            modifier: {
                default: 'content-modifier'
            }
        },
        contents: {
            default: 'Contents'
        },
        copyright: {
            default: 'Copyright',
            owner: {
                default: 'All rights reserved.'
            }
        },
        count: {
            default: 'Count',
            argv: {
                default: 'Conut : {0} cases'
            }
        },
        create: {
            default: 'Create',
            count: {
                default: 'Number of creation'
            },
            id: {
                default: 'Creator Id'
            },
            time: {
                default: 'Creation Date'
            }
        },
        data: {
            default: 'Data',
            change: {
                default: 'Change Data',
                details: {
                    default: 'Data change details'
                },
                previous_later: {
                    default: 'Data before/after change'
                },
                previous: {
                    default: 'Data before change'
                },
                later: {
                    default: 'Data after change'
                }
            },
            tampered: {
                default: 'Data tampering'
            }
        },
        delete: {
            default: 'Delete'
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
            default: 'Details'
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
            default: 'Download'
        },
        duplicate: {
            default: 'Duplication',
            login: {
                default: 'Duplicate login',
                confirm: {
                    default: 'Check for duplicate logins'
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
            default: 'Email'
        },
        emergency: {
            default: 'Emergency',
            status: {
                default: 'Emergency preparedness status'
            }
        },
        encrypt: {
            default: 'encryption'
        },
        error: {
            default: 'Error'
        },
        event: {
            create: {
                default: 'Event Creation',
                id: {
                    default: 'Event creator'
                }
            },
            msg: {
                default: 'Event message',
                details: {
                    default: 'Event message detail screen'
                }
            },
            type: {
                default: 'Event type'
            }
        },
        excel: {
            default: 'Excel'
        },
        execute: {
            default: 'Execute',
            time: {
                default: 'Execution time',
                last: {
                    default: 'Last execute time'
                }
            }
        },
        fast_pattern: {
            default: 'fast_pattern'
        },
        file: {
            default: 'File',
            cert: {
                default: 'CertFile',
                chain: {
                    default: 'CertChainFile'
                }
            },
            name: {
                default: 'File name'
            },
            request: {
                default: 'ReqFile'
            },
            sign: {
                default: 'SignFile'
            },
            unsigned: {
                default: 'UnsignedFile'
            },
            upload: {
                default: 'File upload',
                sign: {
                    default: 'Upload file to sign'
                },
                verify: {
                    default: 'Upload file to verify'
                }
            }
        },
        gid: {
            default: 'gid'
        },
        group: {
            default: 'Group',
            code: {
                default: 'Group code',
                description: {
                    default: 'Detailed explanation of group code'
                },
                details: {
                    default: 'Group code details'
                },
                name: {
                    default: 'Group code name'
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
                default: 'Save ID'
            }
        },
        information: {
            default: 'Information'
        },
        init_vector: {
            default: 'Init Vector'
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
            default: 'Key',
            add: {
                default: 'Add Key'
            },
            delete: {
                default: 'Delete Key'
            },
            group: {
                default: 'Key group',
                details: {
                    default: 'Key group details'
                },
                name: {
                    default: 'Key group name'
                },
                record: {
                    default: 'Key group history',
                    details: {
                        default: 'Key group history details'
                    }
                }
            },
            name: {
                default: 'Key name'
            },
            type: {
                default: 'Key Type'
            }
        },
        value: {
            default: 'value'
        },
        variable: {
            default: 'variable',
            details: {
                default: 'Variable details'
            },
            type: {
                default: 'Type'
            },
            key: {
                default: 'Key'
            },
            value: {
                default: 'Value'
            },
            create: {
                default: 'Create',
                time: 'CreateTime',
                variable: 'Create Variable'
            },
            update: {
                default: 'Update',
                variable: 'Update Variable'
            }
        },
        policy: {
            default: 'policy',
            details: {
                default: 'Policy details'
            },
            title: {
                default: 'Title'
            },
            module_count: { default: 'Module Count' },
            export: { default: 'Export' },
            create: {
                default: 'Create',
                time: 'CreateTime',
                policy: 'Create Policy'
            },
            update: {
                default: 'Update',
                policy: 'Update Policy'
            },
            module_list: {
                snort: 'Snort',
                reputation: 'Reputation',
                port_scan: 'Port Scan',
                ips: 'IPS',
                arp_spoof: 'ARP Spoof',
                alert_syslog: 'Alert Syslog',
                alert_unixsock: 'Alert Unixsock',
                alert_full: 'Alert Full',
                alert_fast: 'Alert Fast'
            }
        },
        language: {
            default: 'Language',
            support: {
                list: {
                    default: ['Korean', 'English', 'Chinese']
                }
            },
            kr: {
                default: 'Korean'
            },
            us: {
                default: 'English'
            },
            cn: {
                default: 'Chinese'
            }
        },
        log: {
            default: 'Log',
            category: {
                default: 'Log type'
            },
            details: {
                default: 'Log details'
            }
        },
        menu: {
            default: 'Menu',
            description: {
                default: 'Menu description'
            },
            details: {
                default: 'Menu details'
            },
            id: {
                default: 'Menu ID',
                1: {
                    default: 'Menu ID1'
                },
                2: {
                    default: 'Menu ID2'
                },
                3: {
                    default: 'Menu ID3'
                },
                4: {
                    default: 'Menu ID4'
                },
                5: {
                    default: 'Menu ID5'
                }
            },
            name: {
                default: 'Menu name'
            },
            url: {
                default: 'Menu URL'
            }
        },
        module: {
            default: 'Module',
            details: {
                default: 'Module details'
            }
        },
        moduleValue: {
            default: 'ModuleValue',
            options: {
                alertAll: {
                    default: 'Alert All'
                },
                allow: {
                    default: 'Allow'
                },
                allowList: {
                    default: 'Allow List'
                },
                blockList: {
                    default: 'Block List'
                },
                daq: {
                    default: 'DAQ'
                },
                daqMode: {
                    default: 'DAQ Mode'
                },
                facility: {
                    default: 'Facility'
                },
                file: {
                    default: 'File'
                },
                hosts: {
                    default: 'Hosts'
                },
                interface: {
                    default: 'Interface'
                },
                inlineMode: {
                    default: 'Inline Mode'
                },
                level: {
                    default: 'Level'
                },
                limit: {
                    default: 'Limit'
                },
                logDir: {
                    default: 'Log Dir'
                },
                mode: {
                    default: 'Mode'
                },
                options: {
                    default: 'Options'
                },
                priority: {
                    default: 'Priority'
                },
                protos: {
                    default: 'Protos'
                },
                rules: {
                    default: 'Rules'
                },
                scanLocal: {
                    default: 'Scan Local'
                },
                scanTypes: {
                    default: 'Scan Types'
                },
                verbose: {
                    default: 'Verbose'
                }
            }
        },
        msg: {
            default: 'Message',
            error: {
                default: 'Error message'
            },
            acronym: {
                default: 'msg'
            }
        },
        name: {
            default: 'Name',
            system: {
                default: 'System name',
                pg: {
                    default: 'AutoCrypt Policy Generator'
                }
            }
        },
        negation: {
            default: 'negation'
        },
        network: {
            default: 'Network'
        },
        non_payload: {
            default: 'Non-Payload'
        },
        notice: {
            default: 'Note',
            reason: {
                default: 'Note (reason)'
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
                default: 'OTP authentication'
            },
            device: {
                default: 'OTP device',
                registration: {
                    default: 'OTP device registration'
                }
            },
            input: {
                default: 'Enter OTP'
            }
        },
        page: {
            default: 'Page',
            argv: {
                default: '{0}',
                entire: {
                    default: '{2} out of {0} to {1}'
                }
            },
            per: {
                default: 'per page',
                data: {
                    default: 'data per page'
                }
            }
        },
        password: {
            default: 'Password',
            confirm: {
                default: 'Verify password'
            },
            current: {
                default: 'Current Password'
            },
            new: {
                default: 'New Password',
                confirm: {
                    default: 'Confirm new password'
                }
            },
            reset: {
                default: 'Reset password'
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
            default: 'Product',
            id: {
                default: 'Product ID'
            }
        },
        project: {
            default: 'Project',
            id: {
                default: 'Project ID'
            }
        },
        public: {
            default: 'Public',
            key: {
                default: 'Public Key'
            }
        },
        qr: {
            default: 'QR Code',
            scan: {
                default: 'QR scan',
                auth: {
                    default: 'Authentication QR scan',
                    method: {
                        default: 'QR scan to register authentication method'
                    }
                },
                device: {
                    default: 'QR scan for device registration'
                }
            }
        },
        read: {
            default: 'Read'
        },
        reason: {
            default: 'Reason'
        },
        region: {
            default: 'Region'
        },
        request: {
            default: 'Request',
            file: {
                default: 'Request file'
            }
        },
        result: {
            default: 'Result',
            file: {
                default: 'Result file'
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
            default: 'Ruleset',
            plural: {
                default: 'Rulesets'
            }
        },
        run: {
            default: 'Run',
            time: {
                default: 'Execution time',
                last: {
                    default: 'Last run time'
                }
            }
        },
        search: {
            default: 'Search',
            condition: {
                default: 'Search Condition'
            }
        },
        seconds: {
            default: 'seconds'
        },
        service: {
            default: 'Service',
            type: {
                default: 'Service type'
            }
        },
        sid: {
            default: 'sid'
        },
        signature: {
            default: 'Signature',
            auto: {
                default: 'Automatic signature processing',
                verify: {
                    default: 'Automatic verification when signing'
                }
            },
            error: {
                default: 'Signature Error'
            },
            info: {
                default: 'Signature Information',
                same: {
                    default: 'Same as signing information'
                }
            },
            not_exist: {
                default: 'No signature'
            },
            request: {
                default: 'Sign Request',
                details: {
                    default: 'Sign Request Details'
                }
            },
            run: {
                default: 'Sign'
            }
        },
        sort: {
            default: 'Sort',
            order: {
                default: 'Sort order'
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
            default: 'Status'
        },
        success: {
            default: 'Success'
        },
        symmetric: {
            default: 'Symmetric',
            key: {
                default: 'Symmetric Key'
            }
        },
        synchronous: {
            default: 'Synchronous',
            request: {
                default: 'Synchronous Request',
                y: {
                    default: 'Response contain signature data'
                },
                n: {
                    default: "Response doesn't contain signature data"
                }
            }
        },
        table: {
            default: 'Table',
            name: {
                default: 'Table name'
            }
        },
        time: {
            default: 'Time'
        },
        title: {
            default: 'Title'
        },
        track: {
            default: 'track'
        },
        type: {
            default: 'Type'
        },
        update: {
            default: 'Update'
        },
        upper: {
            default: 'Precedence',
            menu: {
                default: 'Top menu ID'
            }
        },
        use: {
            yn: {
                default: 'Whether or not to use'
            },
            y: {
                default: 'Use'
            },
            n: {
                default: 'Unused'
            },
            time: {
                default: 'Date of use'
            }
        },
        user: {
            add: {
                default: 'Add user'
            },
            define: {
                default: 'Custom'
            },
            details: {
                default: 'User details'
            },
            id: {
                default: 'User Id'
            },
            name: {
                default: 'Username'
            }
        },
        verify: {
            default: 'Verification',
            fail: {
                default: 'Verification failed'
            },
            run: {
                default: 'Verify'
            },
            status: {
                default: 'Verification Status'
            },
            success: {
                default: 'Verification complete'
            }
        },
        version: {
            default: 'version',
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
