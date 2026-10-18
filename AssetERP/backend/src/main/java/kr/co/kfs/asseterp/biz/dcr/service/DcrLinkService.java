package kr.co.kfs.asseterp.biz.dcr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrLinkCopyReq;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrLinkRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrLinkSaveReq;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrLinkMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS server/dcr/Dcr30_Link.java (selectBySearchId L34 / linkCheck L110 / updateDcrAuth L165 / updateNote L178 / updateForm L189 /
 * updateLink L216 / update L240) — 로그인 회사의 Link를 다루고, 다른 회사는 관리자 회사만
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrLinkService {

    private static final String LINK_KIND_CODE = "LinkCode";

    private final DcrLinkMapper mapper;

    /** AS-IS selectBySearchId: searchText는 LIKE 패턴("%검색어%") */
    public List<DcrLinkRes> search(UserPrincipal user, Long companyId, String searchText) {
        return mapper.selectBySearchId(targetCompany(user, companyId), "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS linkCheck: 모든 회사에 없는 Link 코드를 넣는다(조회가 쓰기) → 새로 넣은 건수. 관리자 회사만 */
    @Transactional
    public int linkCheck(UserPrincipal user) {
        requireSysAdmin(user);
        List<String> linkCodes = mapper.selectLinkCodes(LINK_KIND_CODE);
        int count = 0;
        for (Long companyId : mapper.selectCompanyIds()) {
            for (String linkCode : linkCodes) {
                if (mapper.countByLinkCode(companyId, linkCode) == 0) {
                    mapper.insertLink(mapper.selectNextId(), linkCode, companyId);
                    count++;
                }
            }
        }
        return count;
    }

    /** AS-IS update(UpdateDataModel) + updateDcrAuth: 문서분류·비고를 저장하고, 문서세부분류를 안 쓰는 회사면 분류 권한을 잠근다 */
    @Transactional
    public int update(UserPrincipal user, Long companyId, List<DcrLinkSaveReq> rows) {
        Long target = targetCompany(user, companyId);
        int count = 0;
        for (DcrLinkSaveReq req : rows) {
            if (mapper.updateLinkRow(target, req.linkId(), req.classTreeId(), req.note()) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            count++;
        }
        updateDcrAuth(target);
        return count;
    }

    /** AS-IS updateDcrAuth L165: dcrDetailUseYn이 true가 아니면 회사 Link의 문서분류마다 dcr03_update_yn을 false로 */
    private void updateDcrAuth(Long companyId) {
        if ("true".equals(mapper.selectDcrDetailUseYn(companyId))) {
            return;
        }
        for (Long classTreeId : mapper.selectClassTreeIdsByCompanyId(companyId)) {
            if (classTreeId != null) {
                mapper.updateOrgAuth(classTreeId);
            }
        }
    }

    /** AS-IS updateNote L178: 비고 창의 저장 */
    @Transactional
    public void updateNote(UserPrincipal user, Long linkId, String note) {
        Long owner = mapper.selectLinkCompanyId(linkId);
        if (owner == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        targetCompany(user, owner);
        mapper.updateNote(linkId, note);
    }

    /** AS-IS updateLink L216: 관리자 회사의 Link(문서분류·비고)를 고른 회사들에 복사 → 처리한 건수 */
    @Transactional
    public int copyLink(UserPrincipal user, DcrLinkCopyReq req) {
        requireSysAdmin(user);
        int count = 0;
        for (Long companyId : companies(req)) {
            for (DcrLinkRes link : sourceLinks(user, req)) {
                mapper.upsertLink(companyId, link.linkCode(), link.classTreeId(), link.note(), null);
                mapper.updateOrgAuthByBakDcr(companyId, link.classTreeId());
                count++;
            }
        }
        return count;
    }

    /** AS-IS updateForm L189: 관리자 회사의 데이터연결 양식을 새 양식 행으로 복사하고 고른 회사들의 Link에 연결 → 처리한 건수 */
    @Transactional
    public int copyForm(UserPrincipal user, DcrLinkCopyReq req) {
        requireSysAdmin(user);
        int count = 0;
        for (Long companyId : companies(req)) {
            for (DcrLinkRes link : sourceLinks(user, req)) {
                Long formMappingId = mapper.selectNextId();
                mapper.upsertFormLink(companyId, link.linkCode(), link.classTreeId(), link.note(), formMappingId);
                mapper.insertForm(companyId, link.linkCode(), formMappingId);
                count++;
            }
        }
        return count;
    }

    private List<Long> companies(DcrLinkCopyReq req) {
        if (req.companyIds() == null || req.companyIds().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "복사할 목적지 회사를 선택해주세요");
        }
        return req.companyIds();
    }

    /** 복사 원본: 클라이언트가 보낸 행이 아니라 로그인(관리자) 회사의 Link ID로 서버가 읽는다 */
    private List<DcrLinkRes> sourceLinks(UserPrincipal user, DcrLinkCopyReq req) {
        List<Long> ids = req.linkIds() == null ? List.of() : req.linkIds();
        return ids.stream()
                .map(mapper::selectById)
                .filter(link -> link != null && user.getCompanyId().equals(link.companyId()))
                .toList();
    }

    private void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }

    /** 대상 회사: 없거나 로그인 회사면 로그인 회사, 다른 회사는 관리자 회사만 */
    private Long targetCompany(UserPrincipal user, Long companyId) {
        if (companyId == null || companyId.equals(user.getCompanyId())) {
            return user.getCompanyId();
        }
        requireSysAdmin(user);
        return companyId;
    }
}
