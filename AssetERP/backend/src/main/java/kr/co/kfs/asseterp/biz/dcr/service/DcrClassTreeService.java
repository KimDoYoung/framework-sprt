package kr.co.kfs.asseterp.biz.dcr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.ClassTreeLookupRes;
import kr.co.kfs.asseterp.biz.dcr.dto.ClassTreeNoteRow;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrClassTreeMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/dcr/Dcr01_ClassTree.java (commentInsert L451, selectByText L40) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrClassTreeService {

    /** AS-IS Dcr01_Lookup_SelectMulti.retrieve: 문서분류 구분은 'T' */
    private static final String TYPE_CODE = "T";

    private final DcrClassTreeMapper mapper;

    /**
     * AS-IS selectByText: 사용 중인 문서분류(T) 중 분류코드+문서분류명에 검색어가 든 것.
     * relateTable "TDM47"(책무매뉴얼 점검항목 연결 문서분류, Tdm43_Page_Relate)이면 그 점검항목에 아직 연결 안 된 것만(E13-3)
     */
    public List<ClassTreeLookupRes> searchLookup(UserPrincipal user, String searchText, String relateTable, Long relateId) {
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectLookup(user.getCompanyId(), TYPE_CODE, like, relateTable, relateId);
    }

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
