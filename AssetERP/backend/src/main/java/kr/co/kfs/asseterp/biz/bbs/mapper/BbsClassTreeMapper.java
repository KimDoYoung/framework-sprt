package kr.co.kfs.asseterp.biz.bbs.mapper;

import kr.co.kfs.asseterp.biz.bbs.dto.ClassTreeRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ClassTreeSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/bbs/mapper/bbs30_class_tree.xml + UpdateDataModel(bbs30_class_tree) (Z13 Bbs30_Tab_ClassTree) */
@Mapper
public interface BbsClassTreeMapper {

    List<ClassTreeRes> selectByRoleUserTypeCode(@Param("companyId") Long companyId, @Param("orgId") Long orgId, @Param("personId") Long personId,
                                                @Param("typeCode") String typeCode);

    List<ClassTreeRes> selectByTypeCode(@Param("companyId") Long companyId, @Param("typeCode") String typeCode);

    List<ClassTreeRes> selectByParentTreeId(@Param("companyId") Long companyId, @Param("typeCode") String typeCode, @Param("parentTreeId") Long parentTreeId);

    ClassTreeRes selectById(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId);

    Long selectNextId();

    int insertClassTree(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("r") ClassTreeSaveReq r);

    int updateClassTree(@Param("companyId") Long companyId, @Param("r") ClassTreeSaveReq r);

    int deleteClassTree(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId);

    int updateParentTreeId(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("parentTreeId") Long parentTreeId);

    int updatePublicYn(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("publicYn") boolean publicYn);
}
