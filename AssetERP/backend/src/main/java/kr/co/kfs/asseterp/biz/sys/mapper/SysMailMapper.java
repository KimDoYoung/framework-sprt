package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.SysMailRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface SysMailMapper {

    SysMailRes selectById(@Param("companyId") Long companyId, @Param("mailId") Long mailId);

    long selectNextId();

    String getEncrypts(@Param("text") String text);

    int insertMail(@Param("id") Long id, @Param("companyId") Long companyId, @Param("mailAddress") String mailAddress,
                   @Param("password") String password, @Param("note") String note);

    int updateMail(@Param("companyId") Long companyId, @Param("mailId") Long mailId, @Param("mailAddress") String mailAddress,
                   @Param("password") String password, @Param("note") String note);
}
