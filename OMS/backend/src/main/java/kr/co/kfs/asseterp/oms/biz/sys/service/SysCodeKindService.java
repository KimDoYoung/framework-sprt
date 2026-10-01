package kr.co.kfs.asseterp.oms.biz.sys.service;

import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeKindRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeKindRow;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeKindSaveReq;
import kr.co.kfs.asseterp.oms.biz.sys.dto.CodeKindSearchParam;
import kr.co.kfs.asseterp.oms.biz.sys.mapper.SysCodeKindMapper;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** 공통코드 종류 (AS-IS server/sys/Sys08_CodeKind) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysCodeKindService {

    private final SysCodeKindMapper sysCodeKindMapper;

    /** AS-IS selectByKindName. sysYn: 'true'/'false'/'%'(전체), 없으면 'false' */
    public List<CodeKindRes> searchCodeKinds(String kindNm, String sysYn) {
        return sysCodeKindMapper.searchByKindName(new CodeKindSearchParam(
                kindNm == null || kindNm.isBlank() ? "%" : "%" + kindNm.trim() + "%",
                sysYn == null || sysYn.isBlank() ? "false" : sysYn));
    }

    @Transactional
    public List<CodeKindRes> updateCodeKinds(List<CodeKindSaveReq> rows) {
        List<CodeKindRes> saved = new ArrayList<>(rows.size());
        for (CodeKindSaveReq req : rows) {
            if (req.kindCd() == null || req.kindCd().isBlank() || req.kindNm() == null || req.kindNm().isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "코드구분과 코드구분명을 입력하세요.");
            }
            Long id = req.isNew() ? sysCodeKindMapper.selectNextId() : req.codeKindId();
            if (req.isNew()) {
                sysCodeKindMapper.insert(CodeKindRow.of(id, req));
            } else if (sysCodeKindMapper.update(CodeKindRow.of(id, req)) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(sysCodeKindMapper.selectById(id));
        }
        return saved;
    }

    @Transactional
    public int deleteCodeKinds(List<Long> codeKindIds) {
        return codeKindIds == null || codeKindIds.isEmpty() ? 0 : sysCodeKindMapper.delete(codeKindIds);
    }
}
