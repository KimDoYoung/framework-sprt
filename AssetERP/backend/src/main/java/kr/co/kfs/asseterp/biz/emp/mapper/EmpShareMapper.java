package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.ShareRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EmpShareMapper {

    List<ShareRes> selectByParentId(@Param("companyId") Long companyId, @Param("parentId") Long parentId);

    String selectShareInfo(@Param("companyId") Long companyId, @Param("parentId") Long parentId);

    long selectNextId();

    int insertShare(@Param("companyId") Long companyId, @Param("parentId") Long parentId, @Param("shareId") Long shareId,
                    @Param("shareCode") String shareCode, @Param("personId") Long personId, @Param("orgId") Long orgId);

    int deleteShares(@Param("companyId") Long companyId, @Param("parentId") Long parentId, @Param("shareIds") List<Long> shareIds);
}
