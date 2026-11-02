package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookGroupRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookGroupSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookMemberRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookMemberSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookSelectRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EmpAddrBookGroupMapper {

    /** emp57_addr_book_group.getList — 내 그룹(+ publicYn이면 회사의 공개 그룹) (그룹선택 창 Emp57_Lookup_List) */
    List<EmpAddrBookGroupRes> getList(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("publicYn") boolean publicYn);

    /** emp57_addr_book_group.selectByParentId 전체 열 (그룹선택 창이 돌려줄 값) */
    List<EmpAddrBookSelectRes> selectSelectItemsByParentId(@Param("parentId") Long parentId);

    List<EmpAddrBookGroupRes> getPersonList(@Param("personId") Long personId);

    EmpAddrBookGroupRes selectGroupById(@Param("companyId") Long companyId, @Param("addrBookGroupId") Long addrBookGroupId);

    List<EmpAddrBookMemberRes> selectByParentId(@Param("parentId") Long parentId);

    EmpAddrBookMemberRes selectMemberById(@Param("companyId") Long companyId, @Param("addrBookGroupId") Long addrBookGroupId);

    long selectNextId();

    int insertGroup(@Param("id") Long id, @Param("companyId") Long companyId, @Param("personId") Long personId, @Param("r") EmpAddrBookGroupSaveReq req);

    int updateGroup(@Param("id") Long id, @Param("companyId") Long companyId, @Param("r") EmpAddrBookGroupSaveReq req);

    int insertMember(@Param("id") Long id, @Param("companyId") Long companyId, @Param("personId") Long personId, @Param("r") EmpAddrBookMemberSaveReq req);

    int updateMember(@Param("companyId") Long companyId, @Param("r") EmpAddrBookMemberSaveReq req);

    int deleteAll(@Param("companyId") Long companyId, @Param("addrBookGroupId") Long addrBookGroupId);

    int deleteMember(@Param("companyId") Long companyId, @Param("addrBookGroupId") Long addrBookGroupId);
}
