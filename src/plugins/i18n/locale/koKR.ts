// message roles
// 1: item 3 depth 미만 default 항상 포함
// 2: item 3 depth 이상시 필요시 또는 항목이 여러개일때는 default 추가
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
                months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                months_short: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
            },
            backgroundColor: {
                certificate: ['#b3cad8'],
                system: ['#c3dceb', '#a2786f', '#628d53']
            },
            pie_chart: {},
            line_chart: {
                cert_req: {
                    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                    backgroundColor: ['#00D8FF', '#41B883', '#e5ff00', '#ec3110', '#5b23dd', '#ab31e4']
                }
            }
        }
    },
    btn: {
        default: '버튼',
        account: {
            default: '계정',
            my: {
                default: '내 계정'
            }
        },
        add: {
            default: '추가',
            field: {
                default: '필드 추가'
            }
        },
        cancel: {
            default: '취소'
        },
        clear: {
            default: 'Clear',
            all: {
                default: 'ClearAll'
            }
        },
        close: {
            default: '닫기'
        },
        confirm: {
            default: '확인'
        },
        create: {
            default: '생성'
        },
        delete: {
            default: '삭제'
        },
        download: {
            default: '다운로드'
        },
        excel: {
            default: '엑셀',
            download: {
                default: '엑셀 다운로드'
            },
            upload: {
                default: '엑셀 업로드'
            }
        },
        execute: {
            default: '실행'
        },
        file: {
            default: '파일',
            select: {
                default: '파일 선택'
            }
        },
        import: {
            default: 'Import'
        },
        key: {
            default: '키',
            add: {
                default: '키 추가'
            },
            create: {
                default: '키 생성'
            },
            delete: {
                default: '키 삭제'
            }
        },
        list: {
            default: '목록'
        },
        login: {
            default: '로그인'
        },
        logout: {
            default: '로그아웃'
        },
        password: {
            default: '비밀번호',
            change: {
                default: '비밀번호 변경'
            },
            reset: {
                default: '비밀번호 초기화'
            }
        },
        registration: {
            default: '등록'
        },
        reset: {
            default: '초기화',
            field: {
                default: '필드 초기화'
            }
        },
        run: {
            default: '실행'
        },
        save: {
            default: '저장',
            as: {
                default: 'SaveAs',
                add: {
                    default: 'SaveAs & Add'
                }
            }
        },
        search: {
            default: '검색'
        },
        signature: {
            default: '서명',
            run: {
                default: '서명하기'
            }
        },
        upload: {
            default: '업로드'
        },
        user: {
            default: '사용자',
            registration: {
                default: '사용자 등록'
            }
        },
        verify: {
            default: '검증',
            run: {
                default: '검증하기'
            }
        }
    },
    msg: {
        default: '메세지',
        confirm: {
            default: '확인 하시겠습니까?',
            create: {
                default: '생성 하시겠습니까?',
                name: {
                    default: 'Would you like to create with name?',
                    args: {
                        default: 'Would you like to create a new {0} named "{1}"?'
                    }
                }
            },
            delete: {
                default: '삭제 하시겠습니까?'
            },
            emergency: {
                default: '비상대책 상태를 확인하시겠습니까?',
                change: {
                    default: '비상대책 상태를 변경하시겠습니까?',
                    go: {
                        default: '비상대책 상태를 진행하시겠습니까?'
                    },
                    stop: {
                        default: '비상대책 상태를 정지하시겠습니까?'
                    }
                }
            },
            execute: {
                default: '실행 하시겠습니까?'
            },
            expire: {
                default: '만료 확인 하시겠습니까?',
                auth: {
                    default: '인증이 만료됩니다. 확인 하시겠습니까?',
                    argv: {
                        time: {
                            default: '{0} 초 이내에 인증이 만료됩니다. 갱신하시겠습니까?'
                        }
                    }
                }
            },
            file: {
                default: '파일을 확인하시겠습니까?',
                upload: {
                    default: '파일을 업로드 하시겠습니까?'
                },
                download: {
                    default: '파일을 다운로드 하시겠습니까?'
                }
            },
            login: {
                default: '로그인 하시겠습니까?',
                argv: {
                    duplicate: {
                        default: 'IP [{0}] 의 사용자가 로그인되어 있습니다. 사용중인 사용자를 중지시키시겠습니까?'
                    }
                }
            },
            sign: {
                default: '서명 하시겠습니까?',
                request: {
                    default: '서명 요청을 하시겠습니까?'
                }
            },
            read: {
                default: '조회 하시겠습니까?'
            },
            registration: {
                default: '등록 하시겠습니까?'
            },
            reset: {
                default: '초기화 하시겠습니까?',
                fields: {
                    default: '설정한 Field들을 초기화 하시겠습니까?'
                }
            },
            run: {
                default: '실행 하시겠습니까?'
            },
            update: {
                default: '갱신 하시겠습니까?'
            }
        },
        error: {
            default: '에러',
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
                default: '에러가 발생하였습니다.',
                data: {
                    default: '데이터 관련 에러가 발생하였습니다.',
                    not_exist: {
                        default: '데이터가 존재하지 않습니다.'
                    }
                },
                email: {
                    default: 'email 관련 에러가 발생하였습니다.',
                    confirm: {
                        default: 'email 주소를 확인해 주세요.'
                    }
                },
                file: {
                    default: '파일 관련 에러가 발생하였습니다.',
                    check: {
                        default: '파일을 확인해 주세요.'
                    },
                    download: {
                        default: '파일 다운로드시 에러가 발생하였습니다.'
                    },
                    extension: {
                        default: '파일 확장자 관련 에러가 발생하였습니다.',
                        check: {
                            default: '파일 확장자를 확인해 주세요.'
                        }
                    },
                    not_exist: {
                        default: '파일이 존재하지 않습니다.',
                        argv: {
                            default: '파일 [{0}] 이 존재하지 않습니다.'
                        }
                    },
                    upload: {
                        default: '파일 업로드시 에러가 발생하였습니다.',
                        size: {
                            default: '파일 업로드 크기로 인해 에러가 발생하였습니다.',
                            limit: {
                                default: '파일 업로드 제한된 크기가 넘었습니다.',
                                argv: {
                                    default: '{0}MB 이하 파일만 등록할 수 있습니다.',
                                    base: {
                                        default: '{0}MB 이하 파일만 등록할 수 있습니다. \n\n현재파일 용량 : {1}MB'
                                    }
                                }
                            }
                        }
                    }
                },
                key_group: {
                    default: 'Key Group 관련 에러가 발생하였습니다.',
                    not_exist: {
                        default: 'Key Group 이 존재하지 않습니다.',
                        argv: {
                            default: 'Key Group [{0}] 이 존재하지 않습니다.',
                            create: {
                                default: 'Key Group [{0}] 이 존재하지 않습니다. 자동 생성합니다.'
                            }
                        }
                    }
                },
                login: {
                    default: '로그인에 실패하였습니다.',
                    account: {
                        default: '계정을 확인해 주세요',
                        info: {
                            default: '계정 정보를 확인해 주세요.'
                        },
                        lock: {
                            default: '계정이 잠겨있습니다.'
                        },
                        argv: {
                            default: '계정을 확인해 주세요. 잠김까지 {0} 남음.'
                        }
                    },
                    limit: {
                        default: '로그인이 제한되었습니다.',
                        argv: {
                            default: '로그인 제한 시간 : {0} 까지'
                        }
                    }
                },
                request: {
                    default: '요청에 실패하였습니다.',
                    sign: {
                        default: '사인 요청에 실패하였습니다.'
                    },
                    verify: {
                        default: '검증 요청에 실패하였습니다.'
                    }
                },
                run: {
                    default: '실행 실패하였습니다.'
                },
                unauthorized: {
                    default: '인증 처리중이거나 인증이 만료되었습니다.'
                },
                user: {
                    default: '사용자 정보입니다.',
                    already: {
                        default: '이미 등록된 사용자 정보입니다.'
                    }
                },
                verify: {
                    default: '검증시 오류가 발생하였습니다.'
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
                default: '생성시 오류가 발생하였습니다.',
                registration: {
                    default: '등록시 오류가 발생하였습니다.'
                }
            },
            read: {
                default: '조회시 오류가 발생하였습니다.'
            },
            update: {
                default: '갱신시 오류가 발생하였습니다.'
            },
            delete: {
                default: '삭제시 오류가 발생하였습니다.',
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
                default: '입력된 값이 없습니다.',
                contents: {
                    default: '내용을 입력해 주세요.'
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
                    default: '선택된 값이 없습니다.',
                    blueprint: {
                        default: '선택된 Blueprint가 없습니다.',
                        preset: {
                            default: '선택된 Preset이 없습니다.',
                            field_name: {
                                default: '선택된 필드명이 없습니다.',
                                first: {
                                    default: '필드명을 먼저 선택해주세요.'
                                }
                            }
                        },
                        profile: {
                            default: '선택된 Blueprint Profile이 없습니다.',
                            first: {
                                default: 'Blueprint 프로필을 먼저 선택해주세요.'
                            }
                        }
                    },
                    date: {
                        default: '선택된 날짜가 없습니다.'
                    },
                    file: {
                        defafult: '선택된 파일이 없습니다.',
                        drag: {
                            default: '파일을 선택하거나 여기로 드래그하세요.'
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
                default: '입력된 값이 일치하지 않습니다.',
                password: {
                    default: '입력하신 비밀번호가 일치하지 않습니다.'
                }
            },
            required: {
                default: 'It is required.',
                args: {
                    default: '{0} is required field.'
                }
            },
            wrong_input: {
                default: '입력값을 확인해 주세요.',
                not_allowed: {
                    default: '허용되지 않은 값은 입력할 수 없습니다.',
                    delete: {
                        argv: {
                            auto: {
                                default: '허용되지 않은 값({0})은 자동으로 삭제되었습니다.'
                            }
                        }
                    }
                },
                duplicate: {
                    default: '중복 데이터는 입력할 수 없습니다.',
                    args: {
                        default: '{0} can not be duplicated.'
                    }
                },
                item: {
                    default: '항목의 입력값을 확인해 주세요',
                    argv: {
                        default: '{0} 항목의 입력값을 확인해 주세요'
                    }
                },
                max: {
                    default: '최대값 보다 큽니다.',
                    argv: {
                        default: '최대값 {0} 보다 큽니다. 다시 입력해 주세요.',
                        input: {
                            default: '입력값 {0}은 최대값 {1} 보다 큽니다. 다시 입력해 주세요.',
                            length: {
                                default: '입력값 {0}은 최대 길이 {1} 보다 큽니다. 다시 입력해 주세요.'
                            }
                        }
                    }
                },
                min: {
                    default: '최소값 보다 작습니다.',
                    argv: {
                        default: '최소값 {0} 보다 작습니다. 다시 입력해 주세요.',
                        input: {
                            default: '입력값 {0}은 최소값 {1} 보다 작습니다. 다시 입력해 주세요.',
                            length: {
                                default: '입력값 {0}은 최소 길이 {1} 보다 작습니다. 다시 입력해 주세요.'
                            }
                        }
                    }
                },
                password: {
                    default: '입력하신 패스워드를 확인해 주세요.',
                    rule: {
                        default:
                            '입력하신 패스워드를 확인해 주세요! \n\n규칙: \n최소 8자 이상, \n대/소문자 혼합하여 1자리 이상, \n숫자 1자리 이상, \n특수기호 1자리 이상!!!'
                    }
                }
            }
        },
        info: {
            add: {
                default: '추가 되었습니다.',
                field: {
                    default: 'input을 추가 하였습니다.',
                    no_more: {
                        default: '더 이상 추가할 수 있는 필드가 없습니다.'
                    }
                }
            },
            apply: {
                default: '적용 되었습니다.'
            },
            change: {
                default: '변경 되었습니다.',
                profile: {
                    default: '프로필을 변경하였습니다.',
                    first_click: {
                        default: '프로필 변경하시려면 먼저 클릭해주세요.',
                        reset_field_btn: {
                            default: '프로필 변경을 하시려면 먼저 필드 초기화 버튼을 눌러주세요.'
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
                default: '삭제 되었습니다.'
            },
            emergency: {
                default: '비상대책 상태입니다.',
                not_allow: {
                    default: '비상대책 상태에서는 할 수 없습니다.',
                    args: {
                        default: '비상대책 상태에서는 {0}을(를) 할 수 없습니다.'
                    }
                }
            },
            execute: {
                default: '실행 되었습니다.',
                api: {
                    default: '실행 되었습니다.',
                    sign_retrieve: {
                        default: '서명된 파일 다운로드 요청이 실행 되었습니다.'
                    },
                    product_certificate_chain: {
                        default: '제품 인증서 체인 다운로드 요청이 실행 되었습니다.'
                    }
                }
            },
            file: {
                default: '파일입니다.',
                select: {
                    default: '파일을 선택해 주세요.'
                },
                download: {
                    default: '파일을 다운로드 하였습니다.'
                }
            },
            group_name: {
                default: '그룹명이 정의되었습니다.',
                exist: {
                    default: '이미 존재하는 그룹명 입니다.',
                    no_use: {
                        default: '이미 존재하는 그룹명이므로, 사용하실 수 없습니다.',
                        argv: {
                            default: '{0} 은/는 이미 존재하는 그룹명이므로, 사용하실 수 없습니다.'
                        }
                    }
                }
            },
            input: {
                default: '입력해 주세요.',
                preset: {
                    default: 'Preset을 입력해 주세요.',
                    desc: {
                        default: 'Preset 상세설명을 입력해 주세요.'
                    },
                    title: {
                        default: 'Preset 타이틀을 입력해 주세요.'
                    },
                    value: {
                        default: 'Preset Field를 입력해 주세요.',
                        at_least_one: {
                            default: 'Preset Field를 하나 이상 입력해 주세요.'
                        },
                        not_empty: {
                            default: '비어 있는 Preset Field를 입력해 주세요.'
                        }
                    }
                }
            },
            key: {
                default: '키를 확인해 주세요.',
                type: {
                    default: '키방식을 확인해 주세요.',
                    select: {
                        default: '키방식을 선택해 주세요.'
                    }
                }
            },
            network: {
                default: '네트워크가 사용중 입니다.',
                error: {
                    default: '네트워크 장애입니다.',
                    args: {
                        default: '네트워크 장애 상태에서는 {0}을(를) 할 수 없습니다.',
                        kms: {
                            default: 'KMS 네트워크 장애 상태에서는 {0}을(를) 할 수 없습니다.'
                        }
                    }
                },
                success: {
                    default: '네트워크가 정상처리 중 입니다.',
                    emergency: {
                        default: '네트워크 정상 상태에서는 비상대책 모드를 실행할 수 없습니다.'
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
                default: 'Preset을 확인해주세요.',
                title: {
                    exist: {
                        default: '이미 존재하는 Title 입니다.',
                        no_use: {
                            default: '이미 존재하는 Title이므로 사용하실 수 없습니다.',
                            argv: {
                                default: '{0} 은/는 이미 존재하는 Title이므로, 사용하실 수 없습니다.'
                            }
                        }
                    }
                }
            },
            registration: {
                default: '등록 되었습니다.',
                user: {
                    default: '사용자가 등록 되었습니다.',
                    id: {
                        default: '등록되었습니다. \n사용자ID 로 등록하신 email을 확인해 주세요.'
                    }
                }
            },
            run: {
                default: '실행 되었습니다.'
            },
            save: {
                default: '저장 되었습니다.'
            },
            select: {
                default: '선택해 주세요.',
                preset: {
                    default: 'Preset을 선택해 주세요.',
                    profile: {
                        default: 'Preset 프로필을 선택해 주세요.'
                    }
                }
            },
            sign: {
                default: '서명 되었습니다.',
                options: {
                    default: '서명 옵션입니다.',
                    select: {
                        default: '서명 항목을 선택해주세요.',
                        auto_complete: {
                            default:
                                '서명 항목을 선택해주세요. 선택하시면 자동으로 생성됩니다.(e.g. [파일명]_[YYYYMMDD]_SIG_[키이름]_[uuid])'
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
                default: '검증 되었습니다.',
                options: {
                    default: '검증 옵션입니다.',
                    select: {
                        default: '검증 항목을 선택해 주세요.',
                        auto_complete: {
                            default:
                                '검증 항목을 선택해주세요. 선택하시면 자동으로 생성됩니다.(e.g. [파일명]_[YYYYMMDD]_VER_[키이름]_[uuid])'
                        }
                    }
                }
            }
        }
    },
    voca: {
        default: '단어',
        access: {
            default: '접속',
            time: {
                default: '접속일자'
            }
        },
        account: {
            default: '계정',
            details: {
                default: '계정내역'
            },
            registration: {
                default: '계정등록'
            }
        },
        action: {
            default: 'Action'
        },
        admin: {
            default: '관리자',
            id: {
                default: '관리자ID'
            },
            name: {
                default: '관리자명'
            }
        },
        all: {
            default: '전체'
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
            default: '적용',
            N: {
                default: '미적용'
            },
            Y: {
                default: '적용'
            }
        },
        auth: {
            default: '권한',
            description: {
                default: '권한설명'
            },
            details: {
                default: '권한 상세내역'
            },
            id: {
                default: '권한ID'
            },
            name: {
                default: '권한명'
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
                default: 'Blueprint 코드',
                description: {
                    default: 'Blueprint 코드 상세설명'
                },
                detail: {
                    default: 'Blueprint 코드 상세내역'
                },
                name: {
                    default: 'Blueprint 코드명'
                },
                string_length: {
                    default: '필드 길이제한'
                }
            },
            group: {
                default: 'Blueprint 그룹',
                code: {
                    default: 'Blueprint 그룹코드',
                    description: {
                        default: 'Blueprint 그룹코드 상세설명'
                    },
                    detail: {
                        default: 'Blueprint 그룹코드 상세내역'
                    },
                    name: {
                        default: 'Blueprint 그룹코드명'
                    },
                    type: {
                        default: 'Blueprint 그룹코드 타입'
                    }
                }
            },
            preset: {
                default: 'Blueprint Preset',
                description: {
                    default: 'Preset 상세설명'
                },
                detail: {
                    default: 'Blueprint Preset 상세내역'
                },
                profile: {
                    default: 'Blueprint 프로필'
                },
                title: {
                    default: 'Preset 타이틀'
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
            default: '변경',
            time: {
                default: '변경시간'
            }
        },
        classification: {
            default: '분류'
        },
        client: {
            default: 'Client',
            hash: {
                default: 'Client Hash'
            }
        },
        code: {
            default: '코드',
            description: {
                default: '코드 상세설명'
            },
            details: {
                default: '코드 상세내역'
            },
            item: {
                default: '항목',
                1: {
                    default: '항목1'
                },
                2: {
                    default: '항목2'
                },
                3: {
                    default: '항목3'
                },
                4: {
                    default: '항목4'
                },
                5: {
                    default: '항목5'
                }
            },
            name: {
                default: '코드명'
            }
        },
        company: {
            default: '회사',
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
            default: '확인'
        },
        connection: {
            ip: {
                default: '접속IP'
            },
            status: {
                default: '접속여부'
            }
        },
        content: {
            default: 'content',
            modifier: {
                default: 'content-modifier'
            }
        },
        contents: {
            default: '내용'
        },
        copyright: {
            default: 'Copyright',
            owner: {
                default: 'All rights reserved.'
            }
        },
        count: {
            default: '건수',
            argv: {
                default: '건수 : {0} 건'
            }
        },
        create: {
            default: '생성',
            count: {
                default: '생성개수'
            },
            id: {
                default: '생성자'
            },
            time: {
                default: '생성일자'
            }
        },
        data: {
            default: '데이터',
            change: {
                default: '데이터 변경',
                details: {
                    default: '데이터 변경 상세내역'
                },
                previous_later: {
                    default: '변경 전/후 데이터'
                },
                previous: {
                    default: '변경전 데이터'
                },
                later: {
                    default: '변경후 데이터'
                }
            },
            tampered: {
                default: '데이터 변조'
            }
        },
        delete: {
            default: '삭제'
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
            default: '상세내역'
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
            default: '다운로드'
        },
        duplicate: {
            default: '중복',
            login: {
                default: '중복 로그인',
                confirm: {
                    default: '중복 로그인 확인'
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
            default: '이메일'
        },
        emergency: {
            default: '비상대책',
            status: {
                default: '비상대책 상태'
            }
        },
        encrypt: {
            default: '암호화'
        },
        error: {
            default: '에러'
        },
        event: {
            create: {
                default: '이벤트 생성',
                id: {
                    default: '이벤트 발생자'
                }
            },
            msg: {
                default: '이벤트 메세지',
                details: {
                    default: '이벤트 메세지 상세화면'
                }
            },
            type: {
                default: '이벤트 구분'
            }
        },
        excel: {
            default: 'Excel'
        },
        execute: {
            default: '실행',
            time: {
                default: '실행 시간',
                last: {
                    default: '마지막 실행 시간'
                }
            }
        },
        fast_pattern: {
            default: 'fast_pattern'
        },
        file: {
            default: '파일',
            cert: {
                default: '인증서파일',
                chain: {
                    default: '인증서체인 파일'
                }
            },
            name: {
                default: '파일명'
            },
            request: {
                default: '요청파일'
            },
            sign: {
                default: '서명파일'
            },
            unsigned: {
                default: '서명할 파일'
            },
            upload: {
                default: '파일 업로드',
                sign: {
                    default: '서명할 파일 업로드'
                },
                verify: {
                    default: '검증할 파일 업로드'
                }
            }
        },
        gid: {
            default: 'gid'
        },
        group: {
            default: '그룹',
            code: {
                default: '그룹코드',
                description: {
                    default: '그룹코드 상세설명'
                },
                details: {
                    default: '그룹코드 상세내역'
                },
                name: {
                    default: '그룹코드명'
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
                default: '아이디 저장'
            }
        },
        information: {
            default: '정보'
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
            default: '키',
            add: {
                default: '키 추가'
            },
            delete: {
                default: '키 삭제'
            },
            group: {
                default: '키그룹',
                details: {
                    default: '키그룹 상세내역'
                },
                name: {
                    default: '키그룹 명'
                },
                record: {
                    default: '키그룹 이력',
                    details: {
                        default: '키그룹 이력 상세내역'
                    }
                }
            },
            name: {
                default: '키이름'
            },
            type: {
                default: '키방식'
            }
        },
        language: {
            default: '언어',
            support: {
                list: {
                    default: ['한국어', '영어', '중국어']
                }
            },
            kr: {
                default: '한국어'
            },
            us: {
                default: '영어'
            },
            cn: {
                default: '중국어'
            }
        },
        log: {
            default: '로그',
            category: {
                default: '로그 유형'
            },
            details: {
                default: 'Log 상세내역'
            }
        },
        menu: {
            default: '메뉴',
            description: {
                default: '메뉴설명'
            },
            details: {
                default: '메뉴 상세내역'
            },
            id: {
                default: '메뉴ID',
                1: {
                    default: '메뉴 ID1'
                },
                2: {
                    default: '메뉴 ID2'
                },
                3: {
                    default: '메뉴 ID3'
                },
                4: {
                    default: '메뉴 ID4'
                },
                5: {
                    default: '메뉴 ID5'
                }
            },
            name: {
                default: '메뉴명'
            },
            url: {
                default: '메뉴 URL'
            }
        },
        msg: {
            default: '메세지',
            error: {
                default: '에러 메세지'
            },
            acronym: {
                default: 'msg'
            }
        },
        name: {
            default: '이름',
            system: {
                default: '시스템명',
                pg: {
                    default: 'AutoCrypt Policy Generator'
                }
            }
        },
        negation: {
            default: 'negation'
        },
        network: {
            default: '네트워크'
        },
        non_payload: {
            default: 'Non-Payload'
        },
        notice: {
            default: '비고',
            reason: {
                default: '비고(사유)'
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
                default: 'OTP 인증'
            },
            device: {
                default: 'OTP 기기',
                registration: {
                    default: 'OTP 기기 등록'
                }
            },
            input: {
                default: 'OTP 입력'
            }
        },
        page: {
            default: '페이지',
            argv: {
                default: '{0}',
                entire: {
                    default: '{0} ~ {1} 중 {2}'
                }
            },
            per: {
                default: '페이지 당',
                data: {
                    default: '페이지 당 데이터'
                }
            }
        },
        password: {
            default: '비밀번호',
            confirm: {
                default: '비밀번호 확인'
            },
            current: {
                default: '현재 비밀번호'
            },
            new: {
                default: '새로운 비밀번호',
                confirm: {
                    default: '새로운 비밀번호 확인'
                }
            },
            reset: {
                default: '비밀번호 초기화'
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
            default: '공적',
            key: {
                default: '공개키'
            }
        },
        qr: {
            default: 'QR 코드',
            scan: {
                default: 'QR 스캔',
                auth: {
                    default: '인증 QR 스캔',
                    method: {
                        default: '인증 수단 등록을 위한 QR 스캔'
                    }
                },
                device: {
                    default: '기기 등록을 위한 QR 스캔'
                }
            }
        },
        read: {
            default: '읽기'
        },
        reason: {
            default: '사유'
        },
        region: {
            default: '지역'
        },
        request: {
            default: '요청',
            file: {
                default: '요청파일'
            }
        },
        result: {
            default: '결과',
            file: {
                default: '결과파일'
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
            default: '실행',
            time: {
                default: '실행시간',
                last: {
                    default: '마지막 실행시간'
                }
            }
        },
        search: {
            default: '검색',
            condition: {
                default: '검색조건'
            }
        },
        seconds: {
            default: 'seconds'
        },
        service: {
            default: '서비스',
            type: {
                default: '서비스 구분'
            }
        },
        sid: {
            default: 'sid'
        },
        signature: {
            default: '서명',
            auto: {
                default: '서명 자동처리',
                verify: {
                    default: '서명시 자동검증'
                }
            },
            error: {
                default: '서명 오류'
            },
            info: {
                default: '서명 정보',
                same: {
                    default: '서명하기 정보와 동일'
                }
            },
            not_exist: {
                default: '서명 없음'
            },
            request: {
                default: '서명 요청',
                details: {
                    default: '서명 요청 상세내역'
                }
            },
            run: {
                default: '서명하기'
            }
        },
        sort: {
            default: '정렬',
            order: {
                default: '정렬순서'
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
            default: '상태'
        },
        success: {
            default: '성공'
        },
        symmetric: {
            default: '대칭',
            key: {
                default: '대칭키'
            }
        },
        synchronous: {
            default: '동기화',
            request: {
                default: '요청 동기화',
                y: {
                    default: '응답에 서명 데이터 포함'
                },
                n: {
                    default: '응답에 서명 데이터 미포함'
                }
            }
        },
        table: {
            default: '테이블',
            name: {
                default: '테이블명'
            }
        },
        time: {
            default: '시간'
        },
        title: {
            default: '제목'
        },
        track: {
            default: 'track'
        },
        type: {
            default: '유형'
        },
        update: {
            default: '수정'
        },
        upper: {
            default: '상위',
            menu: {
                default: '상위 메뉴ID'
            }
        },
        use: {
            yn: {
                default: '사용여부'
            },
            y: {
                default: '사용'
            },
            n: {
                default: '미사용'
            },
            time: {
                default: '사용일자'
            }
        },
        user: {
            add: {
                default: '사용자 추가'
            },
            define: {
                default: '사용자 정의'
            },
            details: {
                default: '사용자 상세내역'
            },
            id: {
                default: '사용자ID'
            },
            name: {
                default: '사용자명'
            }
        },
        verify: {
            default: '검증',
            fail: {
                default: '검증실패'
            },
            run: {
                default: '검증하기'
            },
            status: {
                default: '검증상태'
            },
            success: {
                default: '검증완료'
            }
        },
        version: {
            default: '버전',
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
