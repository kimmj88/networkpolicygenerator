// 숫자 정규식 표현 numberRegex => /[^0-9]/;
export const decimalRegex = /^[+-]?\d*(\.?\d*)$/;
export const numberRegex = /[^\d]$/;
export const stringRegex = /[^0-9a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ一-龥\x20]/g;
export const textRegex = /[^0-9a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ一-龥\x20!-/:-@[-`{-~]/g;
export const emailRegex = /^[0-9a-zA-Z.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g;
// 특수기호 1자리 이상, 숫자 1자리이상, 대문자 1자리 이상, 소문자 1자리 이상, 전체 자리수 8자리 이상
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!-/:-@[-`{-~])[A-Za-z\d!-/:-@[-`{-~]{8,}$/g;
export const ipRegex =
    /^(25[0-5]|2[0-4]\d|[01]?\d\d?)((\.(25[0-5]|2[0-4]\d|[01]?\d\d?)){3}|(\.(25[0-5]|2[0-4]\d|[01]?\d\d?)){5})$/g; // nosonar
// eslint-disable-next-line
export const hostname1123Regex =
    /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/g; // nosonar
// eslint-disable-next-line
export const hostname952Regex =
    /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/g; // nosonar

export const carNumberRegex =
    /^(([가-힣]{2}|[가-힣]{4})?\s?(\d{2}|\d{3})\s?[가-힣]\s?\d{4}|임\s?[가-힣]{4,6}\s?(\d{6}|\d{4}))/g; // nosonar
export const IPRegexWithCIDR =
    /\b((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\/([0-9]|[1-2][0-9]|3[0-2]))?\b/; //nosonar
/**
 * 포트 범위는 0 ~ 65535
 * 총 5자리로 계산
 */
export const PortRegex = /^\d{1,5}$|^\d{1,5}:\d{0,5}$|^\d{0,5}:\d{1,5}$/; // nosonar
export const SidRegex = /^\d{0,7}$/; // nosonar
export function getLengthRegx(length: number): RegExp {
    return new RegExp(`^.{0,${length}}$`);
}

export const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/; // nosonar
