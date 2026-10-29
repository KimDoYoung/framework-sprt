package kr.co.kfs.asseterp.biz.apr.service;

import kr.co.kfs.asseterp.biz.apr.dto.AprStampDocApplRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampDocLookupRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampDocSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampDocSumRes;
import kr.co.kfs.asseterp.biz.apr.mapper.AprStampDocMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * AS-IS Apr16_Tab_StampDocManager → server/apr/Apr16_StampDoc.java (selectByApplType L31 / selectApplDocByRegDateIsNull L36 / selectDocByRegDate L41 /
 * selectDocGroupSum L46 / updateRegDate L71 / update L120 / deleteReg L125), sys/Sys99_Print.insertRdStampDocManager L3127
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AprStampDocService {

    private static final String WINDOW_CLASS_NAME = "Apr16_Tab_StampDocManager";

    private final AprStampDocMapper mapper;

    /** applType가 빈 값·"%"이면 전체(null) — 화면 retrieve() L349-354 */
    private static String type(String applType) {
        return (applType == null || applType.isBlank() || "%".equals(applType)) ? null : applType;
    }

    public List<AprStampDocRes> search(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String applType, Long stampReprCorpId) {
        return mapper.selectDocByRegDate(user.getCompanyId(), startDate, closeDate, type(applType), stampReprCorpId);
    }

    public List<AprStampDocSumRes> searchSum(UserPrincipal user, String applType, Long stampReprCorpId) {
        return mapper.selectDocGroupSum(user.getCompanyId(), type(applType), stampReprCorpId);
    }

    public List<AprStampDocLookupRes> searchLookup(UserPrincipal user, String applType) {
        return mapper.selectByApplType(user.getCompanyId(), type(applType));
    }

    public List<AprStampDocApplRes> searchAppl(UserPrincipal user) {
        return mapper.selectApplDocByRegDateIsNull(user.getCompanyId());
    }

    /** AS-IS update → UpdateDataModel. 새 행(ID 없음·0 이하)은 새 ID로 INSERT. 저장한 건수 */
    @Transactional
    public int save(UserPrincipal user, List<AprStampDocSaveReq> rows) {
        Long companyId = user.getCompanyId();
        for (AprStampDocSaveReq r : rows) {
            if (r.stampDocId() == null || r.stampDocId() <= 0) {
                mapper.insertStampDoc(companyId, mapper.selectNextId(), r);
            } else if (mapper.updateStampDoc(companyId, r) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
        return rows.size();
    }

    /** AS-IS deleteReg L125 — 신청일이 없으면 행을 지우고, 있으면(신청에서 온 행) 등록일만 비워 신청내역으로 되돌린다 */
    @Transactional
    public int deleteReg(UserPrincipal user, List<Long> ids) {
        Long companyId = user.getCompanyId();
        for (Long id : ids) {
            if (mapper.countById(companyId, id) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            if (mapper.selectApplDate(companyId, id) == null) {
                mapper.deleteById(companyId, id);
            } else {
                mapper.updateRegDate(companyId, id, null);
            }
        }
        return ids.size();
    }

    /** AS-IS updateRegDate L71 — 신청내역 가져오기: 등록일 = 오늘 */
    @Transactional
    public int registerRegDate(UserPrincipal user, List<Long> ids) {
        LocalDate today = LocalDate.now();
        for (Long id : ids) {
            if (mapper.updateRegDate(user.getCompanyId(), id, today) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
        }
        return ids.size();
    }

    /** AS-IS Sys99_Print.insertRdStampDocManager L3127: ① 내 출력 자료 정리 ② 목록을 sys99_print에 삽입 ③ 새 groupId 반환 */
    @Transactional
    public String insertRdPrint(UserPrincipal user, LocalDate startDate, LocalDate closeDate) {
        long groupId = mapper.selectNextPrintId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME);
        mapper.insertPrint(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME, groupId, startDate, closeDate);
        return String.valueOf(groupId);
    }
}
