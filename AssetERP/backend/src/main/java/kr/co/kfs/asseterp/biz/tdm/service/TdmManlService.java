package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlItemRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmManlMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 부서 책무매뉴얼의 점검항목 (AS-IS Tdm43_Lookup_ManlItem → server/tdm/Tdm43_Manl) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmManlService {

    private final TdmManlMapper mapper;
    private final TdmManlOrgService manlOrgService;

    /** AS-IS tdm.Tdm43_Manl.selectByManlOrgId — 부서 책무매뉴얼의 회사로 권한 범위를 검사한다 */
    public List<ManlItemRes> search(UserPrincipal user, Long manlOrgId, String useYn, String searchText) {
        manlOrgService.requireScope(user, manlOrgId);
        String like = "%" + (searchText == null ? "" : searchText) + "%";
        return mapper.selectByManlOrgId(manlOrgId, useYn, like);
    }

    /**
     * AS-IS tdm.Tdm43_Manl.delete: 연결 법규·내규·양식(tdm45·46·47)과 첨부(sys11)를 지우고 점검항목을 지운다.
     * 요청한 부서 책무매뉴얼의 점검항목이 아니면(점검항목이 없는 관리의무 행의 번호 포함) 거절한다.
     */
    @Transactional
    public void delete(UserPrincipal user, Long manlOrgId, Long manlId) {
        manlOrgService.requireScope(user, manlOrgId);
        if (!manlOrgId.equals(mapper.selectManlOrgIdByManlId(manlId))) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        mapper.deleteRelateIcsByManlId(manlId);
        mapper.deleteRelateIcrByManlId(manlId);
        mapper.deleteRelateDcrByManlId(manlId);
        mapper.deleteRelateFileByParentId(manlId);
        mapper.deleteById(manlId);
    }
}
