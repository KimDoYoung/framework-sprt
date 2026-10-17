package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlRelateIcsRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmManlRelateIcsMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/tdm/Tdm45_ManlRelateIcs.java (selectByIcsId L34 / insertList L39 / delete L68) + Tdm43_Manl.selectByExceptIcsId — Ics01_Lookup_RelateTdm·Ics01_Lookup_SelectTdm.
 * 기준회사(KFS) 책무이행점검항목에 법규를 연결하는 일이라 SQL이 관리자 회사(0)일 때만 행을 준다. 쓰기는 관리자 회사만(보안 보강)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmManlRelateIcsService {

    private final TdmManlRelateIcsMapper mapper;

    /** AS-IS selectByIcsId: 검색어 "%…%" (ILIKE) */
    public List<ManlRelateIcsRes> searchByIcsId(UserPrincipal user, Long icsId, String searchText) {
        return mapper.selectByIcsId(user.getCompanyId(), icsId, like(searchText));
    }

    /** AS-IS Tdm43_Manl.selectByExceptIcsId: 이미 연결된 점검항목을 뺀 목록 */
    public List<ManlRes> searchExceptIcsId(UserPrincipal user, Long icsId, String searchText) {
        return mapper.selectByExceptIcsId(user.getCompanyId(), icsId, like(searchText));
    }

    /** AS-IS insertList: 고른 점검항목마다 법규에 연결(이미 있으면 건너뜀) */
    @Transactional
    public int insertList(UserPrincipal user, Long icsId, List<Long> manlIds) {
        requireSysAdmin(user);
        int count = 0;
        for (Long manlId : manlIds) {
            count += mapper.insert(manlId, icsId);
        }
        return count;
    }

    /** AS-IS delete(GridDeleteData → deleteModel): 연결 제거 → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, Long icsId, List<Long> manlRelateIcsIds) {
        requireSysAdmin(user);
        int count = 0;
        for (Long id : manlRelateIcsIds) {
            count += mapper.deleteById(id, icsId);
        }
        return count;
    }

    private static String like(String searchText) {
        return "%" + (searchText == null ? "" : searchText) + "%";
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
