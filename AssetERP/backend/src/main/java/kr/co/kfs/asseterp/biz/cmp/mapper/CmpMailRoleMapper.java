package kr.co.kfs.asseterp.biz.cmp.mapper;

import kr.co.kfs.asseterp.biz.cmp.dto.CmpMailRoleRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CmpMailRoleMapper {

    List<CmpMailRoleRes> selectByRoleId(@Param("companyId") Long companyId, @Param("mailBookId") Long mailBookId);

    long countMailBook(@Param("companyId") Long companyId, @Param("mailBookId") Long mailBookId);

    long checkPerson(@Param("mailBookId") Long mailBookId, @Param("personId") Long personId);

    long selectNextId();

    int insertRole(@Param("id") Long id, @Param("mailBookId") Long mailBookId, @Param("personId") Long personId);

    int deleteRoles(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
