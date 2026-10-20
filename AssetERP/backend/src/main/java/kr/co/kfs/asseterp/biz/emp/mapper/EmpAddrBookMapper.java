package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookRes;
import kr.co.kfs.asseterp.biz.emp.dto.EmpAddrBookSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EmpAddrBookMapper {

    List<EmpAddrBookRes> selectByText(@Param("personId") Long personId, @Param("searchText") String searchText);

    List<EmpAddrBookRes> selectByPublicText(@Param("companyId") Long companyId, @Param("searchText") String searchText);

    EmpAddrBookRes selectById(@Param("companyId") Long companyId, @Param("addrBookId") Long addrBookId);

    long selectNextId();

    int insertAddrBook(@Param("personId") Long personId, @Param("r") EmpAddrBookSaveReq req);

    int updateAddrBook(@Param("companyId") Long companyId, @Param("r") EmpAddrBookSaveReq req);

    int deleteAddrBook(@Param("companyId") Long companyId, @Param("addrBookId") Long addrBookId);
}
