package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpAddrBookMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/emp/Emp10_AddrBook.java (G11 Emp10_Tab_AddrBook, G12 Emp10_Tab_PublicAddrBook, 그룹설정의 Emp10_Lookup_List) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpAddrBookService {

    private final EmpAddrBookMapper mapper;

    /** AS-IS Emp10_AddrBook.selectByText L43: 내 개인 주소록. 클라이언트가 "%"+글자+"%"로 보내던 것을 여기서 감싼다 */
    public List<EmpAddrBookRes> search(UserPrincipal user, String searchText) {
        return mapper.selectByText(user.getUserId(), like(searchText));
    }

    /** AS-IS Emp10_AddrBook.selectByPublicText L52: 로그인 회사의 공용 주소록 */
    public List<EmpAddrBookRes> searchPublic(UserPrincipal user, String searchText) {
        return mapper.selectByPublicText(user.getCompanyId(), like(searchText));
    }

    /**
     * AS-IS Emp10_AddrBook.update L61 → UpdateDataModel(화면 검사 없음).
     * 새 행(addrBookId 없음·0 이하)은 새 ID로 INSERT(등록자 = 로그인 사원, 공용 여부는 화면이 정한 값). 저장한 행을 요청과 같은 순서로 돌려준다
     */
    @Transactional
    public List<EmpAddrBookRes> save(UserPrincipal user, List<EmpAddrBookSaveReq> rows) {
        Long companyId = user.getCompanyId();
        return rows.stream().map(r -> {
            boolean isNew = r.addrBookId() == null || r.addrBookId() <= 0;
            long id = isNew ? mapper.selectNextId() : r.addrBookId();
            EmpAddrBookSaveReq row = new EmpAddrBookSaveReq(id, r.contactName(), r.emailAddress(), r.mobileTelNo(), r.officeTelNo(),
                    r.companyName(), r.posName(), r.note(), r.publicYn() == null ? "false" : r.publicYn());
            if (isNew) {
                mapper.insertAddrBook(user.getUserId(), row);
            } else if (mapper.updateAddrBook(companyId, row) == 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "주소록을 찾을 수 없습니다");
            }
            return mapper.selectById(companyId, id);
        }).toList();
    }

    /** AS-IS Emp10_AddrBook.delete L70 → UpdateDataModel.deleteModel. 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        return ids.stream().mapToInt(id -> mapper.deleteAddrBook(user.getCompanyId(), id)).sum();
    }

    private static String like(String searchText) {
        return "%" + (searchText == null ? "" : searchText) + "%";
    }
}
