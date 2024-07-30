import * as convertUtil from '@cm/utils/ConvertUtil';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initGrpCodeData = [
    { grpCd: 'CMM001', grpCdNm: 'Service Type', grpCdDc: '서비스 유형', useYn: 'Y' },
    { grpCd: 'CMM100', grpCdNm: 'Variable Type', grpCdDc: '변수 유형', useYn: 'Y' },
    { grpCd: 'CMM200', grpCdNm: 'Rule Action Type', grpCdDc: 'Action 유형', useYn: 'Y' },
    { grpCd: 'CMM201', grpCdNm: 'Rule Protocol Type', grpCdDc: 'Protocol 유형', useYn: 'Y' },
    { grpCd: 'CMM202', grpCdNm: 'Rule Direction Type', grpCdDc: 'Direction 유형', useYn: 'Y' },
    { grpCd: 'CMM203', grpCdNm: 'IP, Port Type', grpCdDc: 'IP, Port 유형', useYn: 'Y' },
    { grpCd: 'CMM204', grpCdNm: 'Content Modifier Type', grpCdDc: 'Content Modifier 유형', useYn: 'Y' },
    { grpCd: 'CMM205', grpCdNm: 'IP Non-Payload Options', grpCdDc: 'IP Non-Payload Options', useYn: 'Y' },
    {
        grpCd: 'CMM206',
        grpCdNm: 'IP Non-Payload ipopts options',
        grpCdDc: 'IP Non-Payload ipopts 선택 가능항목',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM207',
        grpCdNm: 'IP Non-Payload fragbits options',
        grpCdDc: 'IP Non-Payload fragbits 선택 가능 항목',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM208',
        grpCdNm: 'TCP Non-Payload options',
        grpCdDc: 'TCP Non-Payload options',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM209',
        grpCdNm: 'TCP Non-Payload flags options',
        grpCdDc: 'TCP Non-Payload flags 선택 가능 항목',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM210',
        grpCdNm: 'TCP && UDP Non-Payload options',
        grpCdDc: 'TCP && UDP Non-Payload options',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM211',
        grpCdNm: 'TCP && UDP Non-Payload flow options',
        grpCdDc: 'TCP && UDP Non-Payload flow 선택 가능 항목',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM212',
        grpCdNm: 'ICMP Non-Payload options',
        grpCdDc: 'ICMP Non-Payload options',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM213',
        grpCdNm: 'Post Detection options',
        grpCdDc: 'Post Detection options',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM214',
        grpCdNm: 'Detection Filter options',
        grpCdDc: 'Detection Filter 선택 가능 항목',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM215',
        grpCdNm: 'Detection Filter track options',
        grpCdDc: 'Detection Filter track 선택 가능 항목',
        useYn: 'Y'
    },

    { grpCd: 'CMM300', grpCdNm: 'Module Type', grpCdDc: 'Snort Config 유형', useYn: 'Y' },
    { grpCd: 'CMM301', grpCdNm: 'Snort Option Type', grpCdDc: 'Snort option 유형', useYn: 'Y' },
    { grpCd: 'CMM302', grpCdNm: 'Reputation Option Type', grpCdDc: 'Reputation option 유형', useYn: 'Y' },
    { grpCd: 'CMM303', grpCdNm: 'PortScan Option Type', grpCdDc: 'PortScan option 유형', useYn: 'Y' },
    { grpCd: 'CMM304', grpCdNm: 'Ips Option Type', grpCdDc: 'Ips option 유형', useYn: 'Y' },
    { grpCd: 'CMM305', grpCdNm: 'AlertFast Option Type', grpCdDc: 'AlertFast option 유형', useYn: 'Y' },
    { grpCd: 'CMM306', grpCdNm: 'ArpSpoof Option Type', grpCdDc: 'ArpSpoof option 유형', useYn: 'Y' },
    {
        grpCd: 'CMM350',
        grpCdNm: 'Reputation Priority Option Type',
        grpCdDc: 'Reputation 의 Priority option 유형',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM351',
        grpCdNm: 'Reputation Allow Option Type',
        grpCdDc: 'Reputation 의 Allow option 유형',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM352',
        grpCdNm: 'PortScan Protocals Option Type',
        grpCdDc: 'ProtScan 의 Protocals option 유형',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM353',
        grpCdNm: 'PortScan Scan Type Option Type',
        grpCdDc: 'ProtScan 의 Scan Type option 유형',
        useYn: 'Y'
    },
    { grpCd: 'CMM354', grpCdNm: 'Ips Mode Option Type', grpCdDc: 'Ips 의 mode option 유형', useYn: 'Y' },
    { grpCd: 'CMM900', grpCdNm: 'Page', grpCdDc: '페이지당 표현 데이터 수', useYn: 'Y' },
    { grpCd: 'CMM901', grpCdNm: '언어코드', grpCdDc: '다국어 처리 언어코드', useYn: 'Y' },
    { grpCd: 'CMM902', grpCdNm: 'Use YN', grpCdDc: '사용여부 Y/N', useYn: 'Y' },
    { grpCd: 'CMM903', grpCdNm: 'Apply YN', grpCdDc: '적용여부 Y/N', useYn: 'Y' }
];

async function seedMngGrpCode() {
    for (const grpCode of initGrpCodeData) {
        let sGrpCode = convertUtil.camelToSnake(grpCode as any);
        const res = await prisma.mngGrpCode.create({
            data: sGrpCode
        });
    }
}

export default seedMngGrpCode;
