package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookGroupRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookGroupSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookMemberRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookMemberSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EmpAddrBookGroupMapper {

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
