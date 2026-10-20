package kr.co.kfs.asseterp.biz.cmp.mapper;

import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailBookRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CmpMailBookMapper {

    List<CmpMailBookRes> selectByCompanyId(@Param("companyId") Long companyId);

    CmpMailBookRes selectById(@Param("companyId") Long companyId, @Param("mailBookId") Long mailBookId);

    long selectNextId();

    String createPassword(@Param("password") String password);

    int insertMailBook(@Param("id") Long id, @Param("companyId") Long companyId, @Param("emailAddr") String emailAddr,
                       @Param("password") String password, @Param("note") String note);

    int updateNote(@Param("companyId") Long companyId, @Param("mailBookId") Long mailBookId, @Param("note") String note);

    int deleteRolesByMailBookId(@Param("companyId") Long companyId, @Param("mailBookId") Long mailBookId);

    int deleteMailBook(@Param("companyId") Long companyId, @Param("mailBookId") Long mailBookId);

    String selectMailInfo(@Param("companyId") Long companyId);
}
