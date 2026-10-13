package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuHistoryRes;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuHistorySaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysSpecificMenuHistoryMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS server/sys/Sys54_SpecificMenuHistory.java (selectByCompanyId / update / delete / updateByNote) — sys admin만.
 * deleteFile(첨부 삭제)·파일 받기는 B10(sys10_file 공통) 뒤.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysSpecificMenuHistoryService {

    private final SysSpecificMenuHistoryMapper sysSpecificMenuHistoryMapper;

    /** AS-IS selectByCompanyId L26 */
    public List<SpecificMenuHistoryRes> search(UserPrincipal user, Long companyId) {
        requireSysAdmin(user);
        return sysSpecificMenuHistoryMapper.selectByCompanyId(companyId);
    }

    /** AS-IS update(UpdateDataModel) L56: 신규(임시 ID 0 이하)면 INSERT, 아니면 UPDATE → selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<SpecificMenuHistoryRes> update(UserPrincipal user, Long companyId, List<SpecificMenuHistorySaveReq> rows) {
        requireSysAdmin(user);
        List<SpecificMenuHistoryRes> saved = new ArrayList<>();
        for (SpecificMenuHistorySaveReq req : rows) {
            boolean isNew = req.specificMenuHistoryId() == null || req.specificMenuHistoryId() <= 0;
            Long id = isNew ? sysSpecificMenuHistoryMapper.selectNextId() : req.specificMenuHistoryId();
            if (isNew) {
                sysSpecificMenuHistoryMapper.insertSpecificMenuHistory(id, companyId, req);
            } else if (sysSpecificMenuHistoryMapper.updateSpecificMenuHistory(companyId, req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(sysSpecificMenuHistoryMapper.selectById(id));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) L61 → 지운 건수 (첨부 sys10_file 행은 건드리지 않음 — 원본 delete도 같음) */
    @Transactional
    public int delete(UserPrincipal user, Long companyId, List<Long> ids) {
        requireSysAdmin(user);
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        return sysSpecificMenuHistoryMapper.deleteSpecificMenuHistories(companyId, ids);
    }

    /** AS-IS updateByNote L51 */
    @Transactional
    public void updateByNote(UserPrincipal user, Long companyId, Long specificMenuHistoryId, String note) {
        requireSysAdmin(user);
        if (sysSpecificMenuHistoryMapper.updateByNote(companyId, specificMenuHistoryId, note) == 0) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
