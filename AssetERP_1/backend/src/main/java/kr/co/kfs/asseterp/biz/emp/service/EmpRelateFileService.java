package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.RelateFileRes;
import kr.co.kfs.asseterp.biz.emp.dto.RelateFileSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpRelateFileMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/** AS-IS server/emp/Emp18_RelateFile.java */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpRelateFileService {

    private final EmpRelateFileMapper empRelateFileMapper;

    /** AS-IS Emp18_RelateFile.selectByPersonId */
    public List<RelateFileRes> getRelateFiles(UserPrincipal user, Long personId) {
        return empRelateFileMapper.selectRelateFiles(user.getCompanyId(), personId);
    }

    /**
     * AS-IS Emp18_RelateFile.update → UpdateDataModel(emp18_relate_file) → selectById
     * ID ≤ 0: INSERT (f_create_seq). ID > 0: UPDATE. 요청 행마다 저장된 행 1개(파일이 여럿이면 첫 행)를 돌려준다.
     */
    @Transactional
    public List<RelateFileRes> updateRelateFiles(UserPrincipal user, List<RelateFileSaveReq> rows) {
        Long companyId = user.getCompanyId();
        List<Long> resultIds = new ArrayList<>();
        for (RelateFileSaveReq req : rows) {
            if (req.relateFileId() == null || req.relateFileId() <= 0) {
                Long newId = empRelateFileMapper.selectNextId();
                if (empRelateFileMapper.insertRelateFile(newId, companyId, req) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                resultIds.add(newId);
            } else {
                if (empRelateFileMapper.updateRelateFile(req.relateFileId(), companyId, req) == 0) throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                resultIds.add(req.relateFileId());
            }
        }
        return resultIds.stream()
                .map(id -> empRelateFileMapper.selectRelateFileById(id, companyId).get(0))
                .toList();
    }

    /** AS-IS Emp18_RelateFile.delete → UpdateDataModel(emp18_relate_file).deleteModel */
    @Transactional
    public int deleteRelateFiles(UserPrincipal user, List<Long> relateFileIds) {
        if (relateFileIds == null || relateFileIds.isEmpty()) return 0;
        return empRelateFileMapper.deleteRelateFiles(relateFileIds, user.getCompanyId());
    }
}
