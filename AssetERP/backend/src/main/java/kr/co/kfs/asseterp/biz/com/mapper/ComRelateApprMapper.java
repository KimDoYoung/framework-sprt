package kr.co.kfs.asseterp.biz.com.mapper;

import kr.co.kfs.asseterp.biz.com.dto.ComRelateApprRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/com/mapper/com01_relate_appr — 증빙자료 창 Com01_Lookup_RelateAppr (EE34) */
@Mapper
public interface ComRelateApprMapper {

    long selectNextId();

    List<ComRelateApprRes> selectByKeyTableId(@Param("companyId") Long companyId, @Param("keyTableId") Long keyTableId);

    int insertRelateAppr(@Param("relateApprId") long relateApprId, @Param("keyTable") String keyTable, @Param("keyTableId") Long keyTableId,
                         @Param("apprId") Long apprId, @Param("companyId") Long companyId);

    int deleteRelateAppr(@Param("relateApprId") Long relateApprId, @Param("companyId") Long companyId);

    boolean selectApprButtonEnabled(@Param("companyId") Long companyId);

    int countPermission(@Param("apprId") Long apprId, @Param("empId") Long empId, @Param("orgId") Long orgId, @Param("companyId") Long companyId);

    int countPermissionWithDel(@Param("apprId") Long apprId, @Param("empId") Long empId, @Param("orgId") Long orgId, @Param("companyId") Long companyId);
}
