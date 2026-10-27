package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.AstManagerRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstManagerSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface Ast10ManagerMapper {

    List<AstManagerRes> selectByLinkId(@Param("companyId") Long companyId, @Param("linkId") Long linkId);

    AstManagerRes selectById(@Param("managerId") Long managerId);

    long selectNextId();

    int insertManager(@Param("managerId") Long managerId,
                      @Param("companyId") Long companyId,
                      @Param("linkId") Long linkId,
                      @Param("req") AstManagerSaveReq req);

    int updateManager(@Param("companyId") Long companyId,
                      @Param("req") AstManagerSaveReq req);

    int deleteManager(@Param("managerId") Long managerId);

    int deleteByLinkId(@Param("linkId") Long linkId);
}
