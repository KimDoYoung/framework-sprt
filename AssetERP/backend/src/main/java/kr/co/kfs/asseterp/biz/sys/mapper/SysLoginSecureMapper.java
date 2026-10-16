package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.LoginSecureRes;
import kr.co.kfs.asseterp.biz.sys.dto.LoginSecureRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys29_login_secure.xml + UpdateDataModel(sys29_login_secure) — yunhee port-sql·port-save로 옮김 */
@Mapper
public interface SysLoginSecureMapper {
    /** AS-IS selectByCompanyId */
    List<LoginSecureRes> searchLoginSecures(Long companyId);

    LoginSecureRes selectLoginSecure(Long loginSecureId);

    Long selectNextId();

    int insertLoginSecure(LoginSecureRow row);

    int updateLoginSecure(LoginSecureRow row);

    int deleteLoginSecures(@Param("loginSecureIds") List<Long> loginSecureIds, @Param("companyId") Long companyId);
}
