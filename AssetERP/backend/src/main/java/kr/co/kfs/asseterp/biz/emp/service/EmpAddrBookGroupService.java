package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookGroupRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookGroupSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookMemberRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookMemberSaveReq;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpAddrBookGroupMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/emp/Emp57_AddrBookGroup.java (G11 그룹설정: Emp57_Lookup_Insert·Emp57_TabPage_Insert·Emp57_Edit_GroupName) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpAddrBookGroupService {

    private final EmpAddrBookGroupMapper mapper;

    /** AS-IS Emp57_AddrBookGroup.getPersonList L36: 내 회사의 공개 그룹 + 내가 만든 비공개 그룹 */
    public List<EmpAddrBookGroupRes> search(UserPrincipal user) {
        return mapper.getPersonList(user.getUserId());
    }

    /** AS-IS Emp57_AddrBookGroup.modelUpdate L64 (새 그룹: 회사·등록자 = 로그인, 상위·연결 = 0, 새 ID) */
    @Transactional
    public EmpAddrBookGroupRes create(UserPrincipal user, EmpAddrBookGroupSaveReq req) {
        long id = mapper.selectNextId();
        mapper.insertGroup(id, user.getCompanyId(), user.getUserId(), withPublicYn(req));
        return mapper.selectGroupById(user.getCompanyId(), id);
    }

    /** AS-IS Emp57_AddrBookGroup.modelUpdate L64 (고친 그룹: 그룹명·전체공개) */
    @Transactional
    public EmpAddrBookGroupRes update(UserPrincipal user, Long addrBookGroupId, EmpAddrBookGroupSaveReq req) {
        if (mapper.updateGroup(addrBookGroupId, user.getCompanyId(), withPublicYn(req)) == 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "주소록 그룹을 찾을 수 없습니다");
        }
        return mapper.selectGroupById(user.getCompanyId(), addrBookGroupId);
    }

    /** AS-IS Emp57_AddrBookGroup.deleteAll L58: 그룹과 그 안의 담당자 전부. 지운 건수 */
    @Transactional
    public int deleteAll(UserPrincipal user, Long addrBookGroupId) {
        return mapper.deleteAll(user.getCompanyId(), addrBookGroupId);
    }

    /** AS-IS Emp57_AddrBookGroup.selectByParentId L26 */
    public List<EmpAddrBookMemberRes> searchMembers(Long parentId) {
        return mapper.selectByParentId(parentId);
    }

    /** AS-IS Emp57_AddrBookGroup.update L77 → UpdateDataModel. 새 담당자는 새 ID로 INSERT, 고친 행은 비고만. 저장한 행을 요청 순서로 */
    @Transactional
    public List<EmpAddrBookMemberRes> saveMembers(UserPrincipal user, List<EmpAddrBookMemberSaveReq> rows) {
        Long companyId = user.getCompanyId();
        return rows.stream().map(r -> {
            boolean isNew = r.addrBookGroupId() == null || r.addrBookGroupId() <= 0;
            long id = isNew ? mapper.selectNextId() : r.addrBookGroupId();
            if (isNew) {
                if (r.parentId() == null || r.relateId() == null) {
                    throw new BusinessException(ErrorCode.INVALID_INPUT, "그룹과 담당자를 지정해주세요");
                }
                mapper.insertMember(id, companyId, user.getUserId(), r);
            } else if (mapper.updateMember(companyId, r) == 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "그룹 담당자를 찾을 수 없습니다");
            }
            return mapper.selectMemberById(companyId, id);
        }).toList();
    }

    /** AS-IS Emp57_AddrBookGroup.delete L82 → UpdateDataModel.deleteModel. 지운 건수 */
    @Transactional
    public int deleteMembers(UserPrincipal user, List<Long> ids) {
        return ids.stream().mapToInt(id -> mapper.deleteMember(user.getCompanyId(), id)).sum();
    }

    private static EmpAddrBookGroupSaveReq withPublicYn(EmpAddrBookGroupSaveReq req) {
        return new EmpAddrBookGroupSaveReq(req.groupName(), req.publicYn() == null ? "false" : req.publicYn());
    }
}
