package kr.co.kfs.asseterp.biz.dcr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.ClassTreeNoteRow;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrClassTreeMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** AS-IS server/dcr/Dcr01_ClassTree.java (commentInsert만) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrClassTreeService {

    private final DcrClassTreeMapper mapper;

    /** AS-IS commentInsert L451-463: admin(0) 문서분류 중 개요가 있는 것을 같은 구분코드로 대상 회사에 덮어쓴다 → 바뀐 행 수 */
    @Transactional
    public int copyCommentsFromAdmin(UserPrincipal user, Long companyId) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
        int updated = 0;
        for (ClassTreeNoteRow admin : mapper.selectNotesByCompany(0L)) {
            updated += mapper.updateNote(new ClassTreeNoteRow(companyId, admin.classTreeCode(), admin.note()));
        }
        return updated;
    }
}
