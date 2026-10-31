package kr.co.kfs.asseterp.biz.emp.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpTransportApprMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;

/** A42 여비교통비 신청서 상신 뒤 처리 (V36) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpTransportApprService {

    private final EmpTransportApprMapper mapper;

    /**
     * AS-IS Apr01_Edit_ApprDoc(A42 "파일 자동등록") → Apr03_Page_Relate.insertFileList → Sys10_File.copyFile:
     * 신청한 여비교통비마다 영수증 파일을 그 결재문서의 첨부로 연결한다(AS-IS는 문서를 열 때, TOBE는 문서 ID가 정해지는 이 때).
     * 이미 연결된 파일은 다시 넣지 않는다. 연결한 파일 수를 돌려준다.
     */
    @Transactional
    public int linkReceiptFiles(UserPrincipal user, List<Long> ids, Long apprId) {
        if (apprId == null || ids == null || ids.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "결재문서와 여비교통비를 지정해 주세요.");
        }
        int n = 0;
        for (Long id : ids) {
            if (mapper.countOwn(user.getCompanyId(), user.getUserId(), id) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND, "여비교통비 정보를 찾을 수 없습니다.");
            }
            for (Long fileId : mapper.selectFileIds(id)) {
                if (mapper.countApprRelateFile(fileId, apprId) == 0) {
                    n += mapper.insertApprRelateFile(mapper.selectNextId(), fileId, apprId);
                }
            }
        }
        return n;
    }
}
